local CollectionService = game:GetService("CollectionService")

local Entity = require(script.Entity)

local ENTITY_TAG = "_ENTITY_"

local Core = {}
Core.__index = Core

function Core.new()
    local self = {
        --[[
            [name] = {
                [entityidentifier] = component instance
            }
        ]]
        Components = {},
        ComponentClasses = {},
        --[[
            [identifier] = entity instance
        ]]
        Entities = {},
        Queries = {},
        Plugins = {}
    }

    CollectionService:GetInstanceRemovedSignal(ENTITY_TAG):Connect(function(instance)
        self:entityTagRemoved(instance)
    end)

    return setmetatable(self, Core)
end

function Core:entityTagRemoved(instance)
    self.Entities[instance] = nil

    for name,entities in pairs(self.Components) do
        for instance2,entity in pairs(entities) do
            if instance2 == instance then
               self.Components[name][instance2] = nil

                if self.Components[name][instance2].__Properties then
                    for _,property in pairs(self.Components[name][instance2].__Properties) do
                        property:destroy()
                    end

                    self.Components[name][instance2].__Properties = nil
                end
            end
        end
    end

    for _,v in pairs(self.Queries) do
        for _,entity in pairs(v.Cache) do
            if entity.Instance == instance then
                v.Valid = false
            end
        end
    end


    --[[wait(4)


    for name,entities in pairs(self.Components) do
        for instance2,entity in pairs(entities) do
            if instance2 == instance then
               warn("lol this didn't clean at all")
            end
        end
    end
    ]]
end

function Core:getEntity(identifier)
    if self.Entities[identifier] then
        return self.Entities[identifier]
    end
end

function Core:killEntity(identifier)
    if self.Entities[identifier] then
        self.Entities[identifier] = nil
    end
end

function Core:createEntity(instance)
    local identifier = instance

    local entity = Entity.new(identifier, self)

    self.Entities[identifier] = entity

    if typeof(identifier) == "Instance" then
        CollectionService:AddTag(identifier, ENTITY_TAG)
    end

    return entity
end

function Core:fetchEntity(instance)
    if self.Entities[instance] then
        return self:getEntity(instance)
    else
        return self:createEntity(instance)
    end
end

function Core:_addComponentToEntity(entityId, componentName, componentInstance)
    self.Components[componentName][entityId] = componentInstance

    self:_fireQueries(componentName, entityId, "add")

    self:FirePluginEvent("ComponentAdded", entityId, componentName, componentInstance)

    return self.Components[componentName][entityId]
end

function Core:_removeComponentFromEntity(entityId, componentName, componentInstance)
    self:_fireQueries(componentName, entityId, "remove")

    self:FirePluginEvent("ComponentRemoving", entityId, componentName, componentInstance)

    self.Components[componentName][entityId] = nil
end

function Core:_fireQueries(componentName, entityId, type)
    for _,query in pairs(self.Queries) do
        for _,v in pairs(query._OperatingComponents) do
            if v.Tag == componentName then
                --* Fire query resultremoved if the affected entity is in their cache
                query.Valid = false

                if type == "add" then
                    query.resultAdded:Fire(self.Entities[entityId])
                elseif type == "remove" then
                    query.resultRemoved:Fire(self.Entities[entityId])
                end

                break
            end
        end
    end
end

function Core:_recurImport(folder, tbl)
    for _,module in pairs(folder:GetChildren()) do
        if module:IsA('ModuleScript') then
            for index,export in pairs(require(module)) do
                tbl[index] = export
            end
        elseif module:IsA('Folder') then
            self:_recurImport(module, tbl)
        end
    end
end

function Core:RegisterComponentsInFolder(folder)
    local Data = {}
    self:_recurImport(folder, Data)

    for name,componentData in pairs(Data) do
        if not componentData.Tag then
            componentData.Tag = name
        end

        self.Components[name] = {}

        self.ComponentClasses[name] = componentData
    end
end

function Core:Finish()
    self:HandlePlugins()
end

function Core:FirePluginEvent(functionName,...)
    for i = 1,#self.Plugins do
        local thePlugin = self.Plugins[i]

        if (thePlugin[functionName]) then
            thePlugin[functionName](...)
        end
    end
end

function Core:HandlePlugins()
    local plugins= script.Parent.plugins:GetChildren()

    for i = 1,#plugins do
        local pluginModule = require(plugins[i])
        if (pluginModule.Init) then
            pluginModule.Init(self)
        end

       self.Plugins[i] = pluginModule
    end
end

function Core:RegisterQuery(Query)
    table.insert(self.Queries, Query)
end

return Core
