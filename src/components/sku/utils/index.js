function skuCommonfn(sku, selSku, skuKey) {
  let skuKeyList = [];
  Object.keys(sku).forEach((v, vi) => {
    if (sku[`s${vi + 1}`]) skuKeyList.push(sku[`s${vi + 1}`]);
  });
  return skuKeyList.indexOf(selSku) > -1;
}

export function isSkuChoosable(skuList, selectedSku, { key, valueId }) {
  // 先假设sku已选中，拼入已选中sku对象中
  const matchedSku = Object.assign({}, selectedSku, {
    [key]: valueId
  });
  // 再判断剩余sku是否全部不可选，若不可选则当前sku不可选中
  const skusToCheck = Object.keys(matchedSku).filter(skuKey => {
    return matchedSku[skuKey] !== "";
  });
  const filteredSku = skuList.filter(sku => {
    return skusToCheck.every(skuKey => {
      return skuCommonfn(sku, String(matchedSku[skuKey]), skuKey);

      // return String(matchedSku[skuKey]) === String(sku[skuKey])
    });
  });
  const stock = filteredSku.reduce((total, sku) => (total += sku.stock_num), 0);
  return stock > 0;
}

export function getSkuResultGroup(skuList, selectedSku) {
  const skuResultGroup = skuList.filter(sku => {
    return Object.keys(selectedSku).every(skuKey => {
      return skuCommonfn(sku, String(selectedSku[skuKey]), skuKey);
    });
  });
  return skuResultGroup[0];
}

export function getMatchedSku(skuList, selectedSku, propLength) {
  let result;
  // 因为是弱匹配, 所以库存不会准确
  let totalStock = 0;
  const skuKeys = Object.keys(selectedSku);
  let matchedSkus = {};
  let finalComb;
  const r = skuList.filter(skuComb => {
    // 弱匹配..能筛选全部, 但是当全部指定一个的时候就不准.
    let f = false;

    let isSelect = [];
    Object.keys(skuComb).forEach((v, vi) => {
      if (skuCommonfn(skuComb, String(selectedSku[v]), v)) isSelect.push(true);
    });
    if (isSelect.length !== propLength) return;
    for (const skuKeyStr of skuKeys) {
      if (skuCommonfn(skuComb, String(selectedSku[skuKeyStr]), skuKeyStr)) {
        f = true;
        matchedSkus[skuKeyStr] = 1;
        // 改了以后, 唯一的又不行了
        if (Object.keys(matchedSkus).length === propLength) {
          finalComb = skuComb;
          matchedSkus = {};
          return true;
        }
      }
    }

    if (f) {
      if (!result) {
        result = {
          lowest: skuComb,
          highest: skuComb
        };
      } else {
        if (parseFloat(skuComb.price) < parseFloat(result.lowest.price)) {
          result.lowest = skuComb;
        } else if (
          parseFloat(skuComb.price) > parseFloat(result.highest.price)
        ) {
          result.highest = skuComb;
        }
      }
      totalStock += skuComb.stock_num;
    }
    return false;
  });

  if (finalComb) {
    result = {
      lowest: finalComb,
      highest: finalComb,
      final: finalComb,
      totalStock: finalComb.stock_num
    };
  } else if (result) {
    result.totalStock = totalStock;
  }
  return result;
}
