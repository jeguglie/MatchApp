import React from 'react'
import { Icon, Input } from 'semantic-ui-react'

const InputIcon = () => (
    <Input
        icon={<Icon name='search' inverted circular link />}
        placeholder='Search...'
    />
)

export default InputIcon