local CollectionService = game:GetService("CollectionService")

local TaggingPlugin = {}


function TaggingPlugin.Init(core)
    for name,_ in pairs(core.ComponentClasses) do
        local tagged = CollectionService:GetTagged(name)

        local componentClass = core.ComponentClasses[name]

        if (not componentClass) then
            warn("No component class")
            return
        end

        for _,instance in pairs(tagged) do
            local entity = core:createEntity(instance)

            --TODO: Add components based on a modulescript found in the instance.
            entity:addComponent(componentClass.new(entity))
        end

        CollectionService:GetInstanceAddedSignal(name):Connect(function(instance)
            local entity = core:fetchEntity(instance)

            if not entity:hasComponent(componentClass) then
                entity:addComponent(componentClass.new(entity))
            end
        end)

        CollectionService:GetInstanceRemovedSignal(name):Connect(function(instance)
            local entity = core:fetchEntity(instance)

            if entity:hasComponent(componentClass) then
                entity:removeComponent(componentClass)
            end
        end)
    end
end

function TaggingPlugin.ComponentAdded(entityId, componentName)
    if (typeof(entityId) == "Instance") then
        CollectionService:AddTag(entityId, componentName)
    end
end

function TaggingPlugin.ComponentRemoving(entityId, componentName)
    if (typeof(entityId) == "Instance") then
        CollectionService:RemoveTag(entityId, componentName)
    end
end

return TaggingPlugin
