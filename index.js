class BlueUtils {

  nullPlainObject(val) {
    return JSON.stringify(val) === "{}";
  }

  isStr(val) {
    return typeof val === 'string';
  }

  isPlainObject(val) {
    return val && val !== null && (val.toString() === '[object Object]');
  }

  isArray(val) {
    return val instanceof Array;
  }

  isObjcet(val) {
    return this.isPlainObject(val) || this.isArray(val);
  }

  isDef(val) {
    return val !== undefined && val !== null;
  }

  isUndef(val) {
    return val === undefined || val === null;
  }

  isBlankSpace(val) {
    return val.trim().length === 0;
  }

  isTrue(bool) {
    return bool === true;
  }

  isFalse(bool) {
    return bool === false;
  }

  isFunction(fn) {
    return typeof fn === 'function';
  }

  hook(context, callback = function () {
  }, args = []) {
    if (typeof callback === 'function') {
      return callback.apply(context, args);
    }
  }

  each(obj, cb, isReturn = false) {
    if (this.isUndef(obj)) return;
    let i = 0,
      index = 0,
      newVal = [];

    const len = obj.length;

    if (this.isArray(obj)) {
      for (; i < len; i++) {
        if (isReturn) {
          newVal.push(cb(obj[i], i));
        } else {
          cb(obj[i], i);
        }
      }
    } else {
      for (i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (isReturn) {
          newVal.push(cb(obj[i], i, index++));
        } else {
          cb(obj[i], i, index++);
        }
      }
    }

    if (isReturn) return newVal;
  }

  definePropertyVal(obj, key, val) {
    Object.defineProperty(obj, key, {
      configurable: false,
      enumerable: false,
      value: val
    });
  }

  deepCopy(obj) {
    if (!obj || !(obj instanceof Array) && !(obj.toString() === "[object Object]")) return obj;
    const _obj = obj instanceof Array ? [] : {};
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      if ((obj instanceof Array) || (obj instanceof Object)) {
        _obj[key] = this.deepCopy(obj[key]);
      } else {
        _obj[key] = obj[key];
      }
    }
    return _obj;
  }

  extend(object, _object, isDeep = true) {

    if (isDeep) {
      object = this.deepCopy(object);
    }

    const oldObjKeys = this.each(object, (obj, key) => {
      return key;
    }, true);

    this.each(_object, (obj, key) => {

      const findIndexInOld = oldObjKeys.indexOf(key);
      if (findIndexInOld != -1) {
        oldObjKeys.splice(findIndexInOld, 1);
      }

      if (this.isPlainObject(obj)) {
        if (!object[key]) {
          object[key] = {};
        }
        this.extend(object[key], obj, isDeep);
      }
      object[key] = obj;
    });

    this.each(oldObjKeys, (key) => {
      _object[key] = object[key];
    });

    return object;
  }

  //把当前key-value复制到对应对象的key-value上
  copy(object, _object) {
    this.each(_object, (obj, key) => {
      object[key] = obj;
    });
  }

  //获取表达式
  getRegExp(expr) {
    const tm = '\\/*.?+$^[](){}|\'\"';
    this.each(tm, (tmItem, index) => {
      expr = expr.replace(new RegExp('\\' + tmItem, 'g'), '\\' + tmItem);
    });
    return expr;
  }

  getObjLen(obj) {
    let index = 0;
    this.each(obj, () => {
      ++index;
    });
    return index;
  }

  //get link query string
  getLinkParams(link){
    const linkType = link.split('?');
    const queryString = linkType[1];
    if (linkType.length > 0 && queryString && queryString !== '') {
      return queryString;
    }
    return '';
  }

  //query string 转化为 object
  parseParams(queryString) {
    const linkQuery = {};
    if(!queryString) return linkQuery;
    //是否存在原query
    (queryString.split('&') || []).forEach((queryItemString) => {
      const splitQueryItem = queryItemString.split('=');
      const key = splitQueryItem[0];
      const value = splitQueryItem[1];
      linkQuery[key] = value;
    });
    return linkQuery;
  }

  //query 转化为 string
  stringifyParams(query) {
    if(!this.isPlainObject(query)) return '';
    let _query = [];
    this.each(query, (value, key) => {
      _query.push(`${key}=${encodeURIComponent(value)}`);
    });
    return _query.join('&');
  }

}


const blueUtils = new BlueUtils();

module.exports = blueUtils;