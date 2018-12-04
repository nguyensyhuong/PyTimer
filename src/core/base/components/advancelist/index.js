import React, { Component } from 'react'
import SearchList, { HighlightableText } from '../../../../community/react-native-search-list/index';
import Touchable from '../../../../community/react-native-search-list/utils/Touchable';
import Identify from "../../../helper/Identify";
import {StatusBar, StyleSheet,Alert} from 'react-native'
import {Text, View, Button, Icon} from 'native-base'
import variable from "../../../../../native-base-theme/variables/material";
const styles = StyleSheet.create({
    iconStyle : {
        position: 'absolute', right: 0, top: 5
    },
    iconStyleRtl : {
        position: 'absolute', left: 0, top: 5
    }
})
export default class AdvanceList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: this.props.data
        }
    }
    // custom render row
    renderRow (item, sectionID, rowID, highlightRowFunc, isSearching) {
        return (
            <Touchable onPress={() => {this.props.parent.handleSelected(item.type, item.key, item)}}>
                <View key={rowID} style={{flex: 1, marginLeft: 20, marginRight:20, height: 40, justifyContent: 'center'}}>
                    <HighlightableText
                        matcher={item.matcher}
                        text={item.searchStr}
                        textColor={'#000'}
                        hightlightTextColor={'#0069c0'}
                    />
                    {item.selected == true ?
                        <Icon name="ios-checkmark-outline" style={Identify.isRtl() ? styles.iconStyleRtl : styles.iconStyle }/>: null
                    }
                </View>
            </Touchable>
        )
    }

    // render empty view when datasource is empty
    renderEmpty () {
        return (
            <View>
                <Text style={{color: '#979797', fontSize: variable.textSizeBigger, paddingTop: 20}}> No Content </Text>
            </View>
        )
    }

    // render empty result view when search result is empty
    renderEmptyResult (searchStr) {
        return (
            <View>
                <Text style={{color: '#979797', fontSize: variable.textSizeBigger, paddingTop: 20}}> No Result For <Text
                    style={{color: '#171a23', fontSize: variable.textSizeBigger}}>{searchStr}</Text></Text>
                <Text style={{color: '#979797', fontSize: variable.textSizeBigger, alignItems: 'center', paddingTop: 10}}>Please search again</Text>
            </View>
        )
    }

    renderBackButton(){
        return (
            <Button transparent onPress={() => {this.props.parent.showModal()}}><Text style={{color: variable.btnPrimaryColor}}>{Identify.__('Cancel')}</Text></Button>
        )
    }
    renderRightButton(){
        return (
            <Button transparent onPress={() => {}}><Text style={{color: variable.statusBarColor}}>{Identify.__('Cancel')}</Text></Button>
        )
    }
    renderTitle(){
        return (
            <View style={{flex: 1,flexDirection: 'row', justifyContent: 'center' ,alignItems: 'center'}}><Text style={{color: variable.btnPrimaryColor}}>{Identify.__(this.props.title)}</Text></View>
        )
    }

    render(){
        return (
            <View>
                <StatusBar backgroundColor={variable.statusBarColor} barStyle='light-content' />
                <SearchList
                    data={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderEmptyResult={this.renderEmptyResult.bind(this)}
                    renderBackButton={this.renderBackButton.bind(this)}
                    renderTitle={this.renderTitle.bind(this)}
                    renderRightButton={this.renderRightButton.bind(this)}
                    renderEmpty={this.renderEmpty.bind(this)}
                    rowHeight={40}
                    toolbarBackgroundColor={variable.statusBarColor}
                    cancelTitle={Identify.__('Cancel')}
                    onClickBack={() => {console.log('1234');}}
                    searchListBackgroundColor={variable.statusBarColor}
                    searchBarToggleDuration={300}
                    searchInputBackgroundColor={variable.toolbarInputColor}
                    searchInputBackgroundColorActive={variable.toolbarInputColor}
                    searchInputPlaceholderColor={variable.inputColorPlaceholder}
                    searchInputTextColor={variable.inputColor}
                    searchInputTextColorActive={'#000'}
                    searchInputPlaceholder={Identify.__('Search')}
                    sectionIndexTextColor={'#6ec6ff'}
                    searchBarBackgroundColor={variable.statusBarColor}
                />
            </View>
        );
    }
}
AdvanceList.defaultProps = {
    title : 'Search',
    data: [],
    value: '',
};
