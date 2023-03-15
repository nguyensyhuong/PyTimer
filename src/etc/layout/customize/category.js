import { products } from '@helper/constants';
import Device from '@helper/device';

export default {
    container : {

    },
    content : {
        default_catalog_products_list : {
            active: true,
            sort_order: 2000,
            content: require('../../../customize/catalog/components/horizontalProducts').default,
            data: {
                api: products,
                param: {
                    limit : Device.isTablet() ? 16 : 10,
                    offset: 0,
                },
                type: {
                    name: 'idAfter',
                    param : 'filter[cat_id]',
                },
                redux_action: 'add_products_data',
                redux_data_key: 'products_data',
                idName: 'cateId'
            }
        },
    }
}
