module.exports.up = (payload) => {
  return new Promise((resolve, reject) => {
    const query = `
      const modules = [ "dashboard", "user", "customer", "checkList", "serviceOrder", "refund", "map", "fleet", "company", "skill", "calendar" ];
      const defaultModules = [ "dashboard", "user", "customer", "checkList", "serviceOrder" ];
      const nonDefaultModules = [ "refund", "map", "fleet", "company", "skill", "calendar" ];
      const configurableModules = [ "user", "customer", "checkList", "serviceOrder", "refund", "fleet", "company" ];
      const roleIds = [ 1, 2, 3, 4 ];
      const skillModuleName = "skill";
      const skillConfigurations = [ "user", "customer" ];
      const OTHER_TYPE = "other"

      db.workspaces.find({ deleted: false }).forEach(workspace => {
        modules.forEach(moduleName => {
          const moduleCount = db.modules.find({ name: moduleName, workspace: workspace._id }).count();

          if (moduleCount === 0) {
            db.modules.insert({ name: moduleName, workspace: workspace._id, enabled: false, deleted: false, createdAt: new Date() });
          }

          const module = db.modules.findOne({ name: moduleName, workspace: workspace._id });

          roleIds.forEach(roleId => {
            const roleCount = db.module_roles.find({ roleId: roleId, module: module._id }).count();

            if (roleCount === 0) {
              db.module_roles.insert({ roleId: roleId, module: module._id, enabled: false, deleted: false, createdAt: new Date() });
            }
          });

          let configurations = [ "new", "export", "import", "edit", "deleted" ];

          switch (moduleName) {
            case 'user':
              configurations = configurations.concat([ "group" ]);
              break;
            case 'customer':
              configurations = configurations.concat([ "group", "segment", "wallet", "requesterDepartment", "requesterRole" ]);
              break;
            case 'checkList':
              configurations = configurations.concat([ "type" ]);
              break;
            case 'serviceOrder':
              configurations = configurations.concat([ "resume", "view", "validated", "history", "approved", "canceled", "rescheduling", "transport", "unproductive", "pending" ]);
              break;
            case 'refund':
              configurations = configurations.concat([ "view", "paid", "type", "paymentType" ]);
              break;
            case 'fleet':
              configurations = configurations.concat([ "type", "brand", "model", "company", "contract" ]);
              break;
          }

          if (configurableModules.indexOf(moduleName) >= 0) {
            db.module_roles.find({ module: module._id }).forEach(moduleRole => {
              configurations.forEach(configuration => {
                const configurationCount = db.module_role_configurations.find({ name: configuration, moduleRole: moduleRole._id }).count();

                if (configurationCount === 0) {
                  db.module_role_configurations.insert({ name: configuration, moduleRole: moduleRole._id, enabled: false, deleted: false, createdAt: new Date() });
                }
              });
            });
          }

          if (moduleName === skillModuleName) {
            db.module_roles.find({ module: module._id }).forEach(moduleRole => {
              skillConfigurations.forEach(configuration => {
                const configurationCount = db.module_role_configurations.find({ name: configuration, moduleRole: moduleRole._id }).count();

                if (configurationCount === 0) {
                  db.module_role_configurations.insert({ name: configuration, moduleRole: moduleRole._id, enabled: false, deleted: false, createdAt: new Date(), type: OTHER_TYPE });
                }
              });
            });
          }
        });
      });

      db.modules.find({ name: { "$in" : defaultModules } }).forEach(module => db.modules.update({ name: module.name, deleted: false }, { "$set": { default: true } }, { multi: true }));
      db.modules.find({ name: { "$in" : nonDefaultModules } }).forEach(module => db.modules.update({ name: module.name, deleted: false }, { "$set": { default: false } }, { multi: true }));

      const listSubmodules = [ "new", "export", "import" ];
      const actionSubmodules = [ "edit", "deleted", "resume", "view", "validated", "approved", "disapproved", "canceled", "rescheduling", "paid" ];
      const registerSubmodules = [ "group", "segment", "wallet", "requesterDepartment", "requesterRole", "type",
      "transport", "unproductive", "pending", "paymentType", "brand", "model", "company", "contract" ];

      listSubmodules.forEach(submodule => db.module_role_configurations.update({ name: submodule }, { "$set": { type: "list" } }, { multi: true }));
      actionSubmodules.forEach(submodule => db.module_role_configurations.update({ name: submodule }, { "$set": { type: "action" } }, { multi: true }));
      registerSubmodules.forEach(submodule => db.module_role_configurations.update({ name: submodule }, { "$set": { type: "register" } }, { multi: true }));

      db.workspaces.update({ deleted: false }, { "$set": { updatedAt: new Date() } }, { multi: true });
      db.modules.update({ deleted: false }, { "$set": { updatedAt: new Date() } }, { multi: true });
      db.module_roles.update({ deleted: false }, { "$set": { updatedAt: new Date() } }, { multi: true });
      db.module_role_configurations.update({ deleted: false }, { "$set": { updatedAt: new Date() } }, { multi: true });
    `

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}

module.exports.down = (payload) => {
  return new Promise((resolve, reject) => {
    const query = ``

    return payload.connection.instance
      .query(query)
      .then(() => resolve(payload))
      .catch(reject)
  })
}
