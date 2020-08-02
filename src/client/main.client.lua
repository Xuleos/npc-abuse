--this is old leave me alone
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local FastSpawn = TS.import(script, TS.getModule(script, "fast-spawn")).spawn

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local systemsFolder = script.Parent:WaitForChild("systems")
local componentsFolder = script.Parent:WaitForChild("components")

local sharedFolder = ReplicatedStorage:WaitForChild("TS")
local sharedComponentFolder = sharedFolder:WaitForChild("components")
local sharedSystemsFolder =  sharedFolder:WaitForChild("systems")

local Framework = require(sharedFolder:WaitForChild("framework"))

local function LoadSystem(module)
    local _exports = require(module)

    if typeof(_exports) ~= "table" then
        error(module.Name.." doesn't export a table")
    end

    for _,export in pairs(_exports) do
        if typeof(export) == "table" and export.new and export["start"] then
            if export.disabled ~= true then
                --gotta do the stuffs here
                export.mallow = Framework.Mallow
                local System = export.new()
                System.systems = Framework.ClientSystems
                Framework.ClientSystems[module.Name] = System
            end
        else
            warn(module.name.." exports something that doesn't qualify as a system")
        end
    end
end

local function recur(search)
    for _,child in pairs(search:GetChildren()) do
        if child:IsA("ModuleScript") then
            LoadSystem(child)
        elseif child:IsA('Folder') then
            recur(child)
        else
            error(child.Name.." should not be a "..child.ClassName)
        end
    end
end

--Initiation

Framework.Mallow:RegisterComponentsInFolder(componentsFolder)
Framework.Mallow:RegisterComponentsInFolder(sharedComponentFolder)

Framework.Mallow:Finish()

recur(systemsFolder)
recur(sharedSystemsFolder)

for _,system in pairs(Framework.ClientSystems) do
    if system["start"] then
        FastSpawn(system["start"], system)
    else
        warn("Couldn't find start method in this system");
    end
end
