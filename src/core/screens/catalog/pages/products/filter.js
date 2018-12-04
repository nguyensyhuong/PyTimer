import React from 'react';
import { Container } from "native-base";
import { FlatList, ScrollView, View } from 'react-native';
import { ListItem, Left, Right, Icon, Text, Button, Body, H3 } from "native-base";
import { HeaderApp } from "../../../../base/components/layout/config";
import Identify from '../../../../helper/Identify';
import NavigationManager from '../../../../helper/NavigationManager';
import styles from './styles';
import SimiPageComponent from '../../../../base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class Filter extends SimiPageComponent {
	constructor(props) {
		super(props);
		this.isPage = true;
		this.parent = this.props.navigation.getParam("parent");
		this.selected = this.props.navigation.getParam("filter");
		this.title = Identify.__('Filter By');
	}

	openSelection = (item) => {
		NavigationManager.openPage(this.props.navigation, 'FilterSelection', {
			parent: this.parent,
			attribute: item,
			seleted: this.selected.layer_state
		});
	}

	onRemoveFilter = (remove) => {
		if (remove.attribute != 'cat') {
			let params = {};
			let selected = this.selected.layer_state;
			for (let i = 0; i < selected.length; i++) {
				let item = selected[i];
				if (item.attribute != 'cat' && item.attribute != remove.attribute) {
					params['filter[layer][' + item.attribute + ']'] = item.value;
				}
			}

			this.parent.onFilterAction(params);

			NavigationManager.backToPreviousPage(this.props.navigation);
		}
	}

	onClearFilter() {
		this.parent.onFilterAction(null);
		NavigationManager.backToPreviousPage(this.props.navigation);
	}

	createSelectedListProps() {
		return {
			data: this.props.navigation.getParam("filter").layer_state,
			showsVerticalScrollIndicator: false
		};
	}

	renderItemSelected(item) {
		return (
			<ListItem onPress={() => { this.onRemoveFilter(item) }}>
				<Left>
					<View style={styles.selectedContainer}>
						<Text style={styles.itemText}>{item.title}:</Text>
						<Text style={styles.selectedText}>{item.label}</Text>
					</View>
				</Left>
				<Right>
					<Icon name="md-close" />
				</Right>
			</ListItem>
		);
	}

	createSelectionListProps() {
		return {
			data: this.props.navigation.getParam("filter").layer_filter,
			showsVerticalScrollIndicator: false
		};
	}

	renderItemSelection(item) {
		return (
			<ListItem onPress={() => { this.openSelection(item) }}>
				<Left>
					<Text style={styles.itemText}>{item.title}</Text>
				</Left>
				<Right>
					<Icon name="ios-arrow-forward" />
				</Right>
			</ListItem>
		);
	}

	renderPhoneLayout() {
		return (
			<ScrollView style={{ backgroundColor: variable.appBackground }}>
				<H3 style={styles.title}>{Identify.__('ACTIVATED')}</H3>
				<FlatList
					{...this.createSelectedListProps()}
					keyExtractor={(item) => item.attribute}
					renderItem={({ item }) => this.renderItemSelected(item)} />
				<Body style={styles.btnClearContainer}>
					<Button bordered warning onPress={() => { this.onClearFilter() }}>
						<Icon name='md-close' />
						<Text>{Identify.__('Clear All')}</Text>
					</Button>
				</Body>
				<H3 style={styles.title}>{Identify.__('SELECT A FILTER')}</H3>
				<FlatList
					{...this.createSelectionListProps()}
					keyExtractor={(item) => item.attribute}
					renderItem={({ item }) => this.renderItemSelection(item)} />
			</ScrollView>
		);
	}
}

export default Filter;
