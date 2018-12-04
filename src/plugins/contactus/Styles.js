import { StyleSheet } from "react-native";
import { scale } from 'react-native-size-matters';

export default StyleSheet.create({
    list: {
        marginTop: scale(20),
        borderBottomWidth: 1,
        borderColor: '#aeaeae',
    },
    listItem: {
        width: '100%',
        flex: 1,
        alignContent: 'flex-start',
        borderTopWidth: 1,
        borderColor: '#aeaeae',
    },
    listItemTouchable: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    listItemIcon: {
        width: 60,
        height: 60,
        paddingTop: 14,
        paddingLeft: 17,
        fontSize: 30,
        borderWidth: 1,
    },
    listItemTitle: {
        textAlign: 'left',
        paddingTop: 18,
    },
    grid: {
        marginTop: scale(20),
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    gridItem: {
        margin:5,
        width: '36%',
        height: 150,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    gridItemTouchable: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    gridItemIcon: {
        borderWidth: 1,
        width: 60,
        height: 60,
        borderRadius: 30,
        paddingTop: 14,
        paddingLeft: 17,
        fontSize: 30,
    },
    gridItemTitle: {
        margin: scale(15),
        textAlign: 'center',
        width: '100%',
        fontSize: 14,
    },
})
