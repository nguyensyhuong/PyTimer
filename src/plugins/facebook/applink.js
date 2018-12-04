import NavigationManager from '@helper/NavigationManager';

export function processAppLink(link, navigation) {
    if (!link.startsWith('http')) {
        let parts = link.split('?');
        let content = parts[0];
        let param = content.split('://');
        if (param[1].includes('category_id')) {
            let subParam = param[1].split('&');
            let cateID = subParam[0].split('=')[1];
            let hasChild = subParam[1].split('=')[1];
            if (hasChild == '1') {
                routeName = 'Category';
                params = {
                    categoryId: cateID,
                    categoryName: 'Facebook App Links',
                };
            } else {
                routeName = 'Products';
                params = {
                    categoryId: cateID,
                    categoryName: 'Facebook App Links',
                };
            }
            NavigationManager.openRootPage(navigation, routeName, params);
        } else if (param[1].includes('product_id')) {
            let productID = param[1].split('=')[1];
            NavigationManager.openRootPage(navigation, 'ProductDetail', {
                productId: productID,
            });
        }
        return true;
    }
    return false;
}