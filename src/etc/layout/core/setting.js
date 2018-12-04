import Identify from "../../../core/helper/Identify";

export default {
    container: {},
    content : {
        setting_store:{
            active: true,
            sort_order: 1000,
            content: require('@base/components/menu/ValueMenuItem').default,
            data:{
                itemIcon: 'md-locate',
                ItemToShow: Identify.__('Stores'),
                hasDataInParent: true,
                keyItem: 'store'
            }
        },
        setting_language:{
            active: true,
            sort_order: 2000,
            content: require('@base/components/menu/ValueMenuItem').default,
            data:{
                itemIcon: 'md-map',
                ItemToShow: Identify.__('Language'),
                ItemName: 'store_name',
                keyItem: 'language'
            }
        },
        setting_currency:{
            active: true,
            sort_order: 3000,
            content: require('@base/components/menu/ValueMenuItem').default,
            data:{
                itemIcon: 'md-cash',
                ItemToShow: Identify.__('Currency'),
                ItemName: 'currency_code',
                keyItem: 'currency'
            }
        },
        setting_app:{
            active: true,
            sort_order: 4000,
            content: require('@base/components/menu/ValueMenuItem').default,
            data:{
                itemIcon: 'md-settings',
                ItemToShow: Identify.__('App Settings'),
                typeAction: 2
            }
        }
    }
}