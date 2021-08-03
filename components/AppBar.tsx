import React from 'react'
import {Box, Text, StatusBar, HStack, IconButton, Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';

const AppBar = () => {
    return <>
        <StatusBar backgroundColor="#3700B3" barStyle="light-content"  />
        <Box safeAreaTop w="100%" bg="#6200ee">
            <HStack bg='#6200ee' px={1} py={3} justifyContent='space-between' alignItems='center'>
            
            </HStack>
        </Box>
    </>
}

export default AppBar