local RunService = game:GetService("RunService")

local typesToValuesMap = {
    string = "StringValue",
    boolean = "BoolValue",
    number = "NumberValue",
    integer = "IntValue",
    Instance = "ObjectValue",
    Color3 = "Color3Value",
    Vector3 = "Vector3Value"
}

local RemoteProperty = {}
RemoteProperty.__index = RemoteProperty
function RemoteProperty.new(args)
    local self = setmetatable({}, RemoteProperty)

    local instance = args.component.entity.Instance

    local server = RunService:IsServer()

    if server then

        self.value = Instance.new(typesToValuesMap[args.propertyType])


        if not self.value then
            error(args.propertyType.." is not supported by remote property")
        end

        if args.initialValue then
            self.value.Value = args.initialValue
        end

        self.value.Name = args.name
        self.value.Parent = instance
    else
        self.value = instance:FindFirstChild(args.name)

        if not self.value or not self.value:IsA(typesToValuesMap[args.propertyType]) then
            error("Could not find remote property on client")
        end
    end

    local properties = args.component.__Properties

    if not properties then
        properties = {}
    end

   properties[#properties + 1] = self

    return self
end

function RemoteProperty:get()
    return self.value.Value
end

function RemoteProperty:set(newVal)
    self.value.Value = newVal

    return newVal
end

function RemoteProperty:destroy()
    if self.value then
        self.value:Destroy()
    end
end

return RemoteProperty
