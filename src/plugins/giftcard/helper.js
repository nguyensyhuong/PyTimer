import React from 'react'
import {View, Text} from 'native-base'
class helperGiftCard {
    static renderListCodeLayoutItem(data, title, specialDesgin=false){
        let styleSpecial = {justifyContent: 'center', borderWidth: 0.5, borderRadius: 5, textAlign: 'center', padding: 5, fontWeight: '900'}
        return (
            <View style={{flex: 1, flexDirection: 'row', marginEnd: 25}}>
                <View style={{flexGrow: 1, width: '30%'}}>
                    <Text>{title}</Text>
                </View>
                <View style={{flexGrow: 2, width: '70%'}}>
                    <Text style={specialDesgin ? styleSpecial : {}}>{data}</Text>
                </View>
            </View>
        )
    }

    static checkStatus = (stt) => {
        let str = null;
        switch (parseInt(stt,10)){
            case stt = 1 :
                str = 'Pending';
                break;
            case stt = 2:
                str = 'Active';
                break;
            case stt = 3:
                str = 'Disable';
                break;
            case stt = 4:
                str = 'Used';
                break;
            case stt = 5:
                str = 'Expired';
                break;
            case stt = 6:
                str = 'Delete';
                break;
            default:
                str = 'Pending';
                break;
        }
        return str;
    }

    static validateData(data){
        if(data === null || data === ''){
            return 'N/A'
        }
        return data;
    }
}
export default helperGiftCard;