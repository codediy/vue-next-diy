function getSequence(arr) {
    const p = arr.slice();

    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;

    for (i = 0; i < len; i++) {
        /*当前项*/
        const arrI = arr[i];
        /*最后一项*/
        j = result[result.length - 1];
        /*顺序遍历查找复合条件的*/
        if (arrI > arr[j]) {
            result.push(i);
            p[i] = j;
            continue;
        }

        /*二分查找插入*/
        u = 0;
        v = result.length - 1;
        while (u < v) {
            /*c从中间开始*/
            c = (u + v) / 2 | 0;
            if (arr[result[c]] < arrI) {
                u = c + 1;
            } else {
                v = c;
            }
        }
        if(arrI < arr[result[u]]){
            if (u > 0) {
                p[i] = result[u - 1];
            }
            result[u] = i;
        }
    }

    /*倒序遍历*/
    u = result.length - 1;
    v = result[u];

    while (u >= 0) {
        result[u] = v;
        v = p[v];
        u = u - 1;
    }
    return result;
}


console.log(getSequence([1, 2, 5, 3, 0, 4]));
/*
* 最长上升子序列[1,2,3,4]
* 输出索引[0,1,3,5]
* */