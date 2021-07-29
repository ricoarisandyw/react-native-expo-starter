import React from 'react'
import {Box, Text, StatusBar, HStack, IconButton, Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';

const AppBar = () => {
    return <>
        <StatusBar backgroundColor="#3700B3" barStyle="light-content"  />
        <Box safeAreaTop w="100%" bg="#6200ee">
            <HStack bg='#6200ee' px={1} py={3} justifyContent='space-between' alignItems='center'>
            <HStack space={4} alignItems='center'>
                <IconButton icon={<Icon size="sm" as={<MaterialIcons name='menu' />} color="white" />} />
                <Text color="white" fontSize={20} fontWeight='bold'>Home</Text>
            </HStack>
            <HStack space={2}>
                <IconButton icon={<Icon as={<MaterialIcons name='favorite' />} size='sm' color="white" />} />
                <IconButton icon={<Icon as={<MaterialIcons name='search' />}
                color="white" size='sm'  />} />
                <IconButton icon={<Icon as={<MaterialIcons name='more-vert' />} size='sm' color="white" />} />
            </HStack>
            </HStack>
        </Box>
    </>
}

export default AppBar