"use strict"
const React = require("react")
const { Box,Text } = require("ink")


module.exports=({size})=>(
    <Box flexDirection="column" height={size} width={size} alignItems="center" justifyContent="center">
        <Text color="red">
            You Died
        </Text>
    </Box>
);