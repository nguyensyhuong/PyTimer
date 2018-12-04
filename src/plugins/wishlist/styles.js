import { StyleSheet } from "react-native";
import material from '../../../native-base-theme/variables/material';

export default StyleSheet.create({
    verticalList: {
        marginLeft: 5,
        marginRight: 5
    },
    title: {
        fontFamily: material.fontBold,
    },
    imageListItem: {
        borderColor: '#dedede', height: 110, width: 110, borderWidth: 1 
    },
    itemView:{
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start', 
        paddingTop:5, 
        paddingBottom:15, 
        paddingLeft:5, 
        paddingRight:5 
    },
    buttonIcon:{
        width: 40, 
        height: 40, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingLeft: 10
    },
    outOfStock: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
        fontWeight: "bold",
        fontSize: material.textSizeSmall
    },
})
