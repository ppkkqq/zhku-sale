/**
 *
 * @param {*} original { skuList:[], propList:[] }
 * @param {Object} {priceType: 获取的价格key} {idType: 获取的id key}
 */
export function convert(original, { priceType = "guidePrice", idType = "id" }) {
  // debugger
  let ksIndex = 1;
  const t = original.propList.reduce((result, attr) => {
    let node = result[attr.name];
    if (!node) {
      node = {
        k: attr.name,
        v: [],
        k_s: `s${ksIndex}`
      };
      ksIndex += 1;
    }
    node.v.push({ id: attr.id, name: attr.value, attrId: attr.id });
    result[attr.name] = node;
    return result;
  }, {});
  //这样实现从O(n^2)变成O(2n)
  const tree = [];
  Object.keys(t).forEach(k => {
    tree.push(t[k]);
  });
  const list = original.skuList.reduce((result, sku) => {
    const newSku = {
      ...sku,
      id: sku[idType],
      price: sku[priceType],
      purchaseTax: sku.purchaseTax,
      stock_num: sku.stockCount
    };
    //这里有个问题, 后台接口不是严格[1,null,3], 而是[1,3]的话, 选3会搜索不准
    sku.propIds.forEach((id, index) => {
      newSku[`s${index + 1}`] = id;
    });

    result.push(newSku);
    return result;
  }, new Array());
  return {
    list,
    tree
  };
}

/**
 *
 * @export
 * @param {*} original
 */
export function convertCombo(original) {
  let ksIndex = 0;
  const sku = original.pcUnkeepBundleList.reduce(
    (result, attr) => {
      result.tree[0].v.push({ id: attr.id, name: attr.bundleName });
      result.list.push({
        id: attr.id,
        price: attr.bundlePrice,
        s1: attr.id,
        stock_num: 1000, // 不确定有没有库存
        unkeepServiceList: attr.unkeepServiceList
      });
      return result;
    },
    {
      tree: [
        {
          k: "保养套餐包",
          v: [],
          k_s: `s1`
        }
      ],
      list: []
    }
  );
  return sku;
}

/**
 *
 * @param {*} original  { itemAttributes:[], skus:[] }
 * @param {*} param1
 */
export function convertNew(original, { priceType }) {
  let ksIndex = 1;
  // 转换选择分组
  const tree = original.itemAttributes.reduce((result, attr) => {
    if (attr.type === "sale") {
      const node = {
        k: attr.propName,
        k_id: attr.itemId,
        k_s: `s${ksIndex}`,
        v: []
      };
      const skuValues = attr.propValue.split(",");
      skuValues.forEach(value => {
        node.v.push({
          id: value,
          name: value
        });
      });

      result.push(node);
      ksIndex += 1;
    }
    return result;
  }, []);
  // 转换库存单位
  const list = original.skus.reduce((result, sku) => {
    const item = {
      id: sku.id,
      code: sku.propCodes,
      propNames: sku.propNames,
      price: sku[priceType], // TODO 这里还需要判断登录
      stock_num: sku.stockCount
    };

    const props = sku.propValues.split(",");
    props.forEach((prop, index) => {
      item[`s${index + 1}`] = prop;
    });

    result.push(item);
    return result;
  }, []);

  return {
    tree,
    list
  };
}
