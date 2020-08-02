local Component = {}
Component.__Index = Component


function Component:constructor(Entity)
    self.entity = Entity
end

function Component:update(member, newValue)
    --if self[member] ~= nil then
        self[member] = newValue
   -- else
    --    error("Cannot find "..member.." of"..self)
    --end
end

return Component