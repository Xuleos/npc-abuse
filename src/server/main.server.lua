--this is old leave me alone
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local FastSpawn = TS.import(script, TS.getModule(script, "fast-spawn")).spawn

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local systemsFolder = script.Parent:FindFirstChild("systems")
local componentsFolder = script.Parent:FindFirstChild("components")

local sharedFolder = ReplicatedStorage:WaitForChild("TS")

local Framework = require(sharedFolder.framework)

local sharedComponentFolder = sharedFolder:FindFirstChild("components")
local sharedSystemsFolder = sharedFolder:FindFirstChild("systems")

local function LoadSystem(module)
    local _exports = require(module)

    if typeof(_exports) ~= "table" then
        error(module.Name.." isn't a system file but is in the systems folder")
    end

    for _,export in pairs(_exports) do
        if typeof(export) == "table" and export.new then
            if export.Disabled ~= true then
                --gotta do the stuffs here
                export.mallow = Framework.mallow
                local system = export.new()
                system.systems = Framework.ServerSystems;
                Framework.ServerSystems[module.Name] = system
            end
        end
    end
end

local function recurLoadSystems(search)
    for _,child in pairs(search:GetChildren()) do
        if child:IsA("ModuleScript") then
            LoadSystem(child)
        elseif child:IsA('Folder') then
            recurLoadSystems(child)
        else
            error(child.Name.." should not be a "..child.ClassName)
        end
    end
end

--Actual Initiation
Framework.mallow:RegisterComponentsInFolder(componentsFolder)
Framework.mallow:RegisterComponentsInFolder(sharedComponentFolder)

Framework.mallow:Finish()

recurLoadSystems(systemsFolder)
recurLoadSystems(sharedSystemsFolder)

local method = "start"

for _,system in pairs(Framework.ServerSystems) do
    if system[method] then
        FastSpawn(system[method], system)
    else
        warn("Couldn't find "..method.." in this system");
    end
end
