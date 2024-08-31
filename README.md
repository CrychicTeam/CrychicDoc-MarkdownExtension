# JS OOP

## 简述

&emsp;&emsp;JS OOP是一个旨在在您编写JavaScript脚本时提供一套OOP（面向对象）语法规范的VSC插件

## 语法

### 类|Class

&emsp;&emsp;在本插件中，类被定义为拓展名为`.class.js`，对于类对象有以下代码规范。

#### 声明

&emsp;&emsp;为了确保对不同版本JS的兼容性，声明类时不支持使用class关键字进行声明，且类名应与文件名保持一致，下面是示例代码。

```javascript
//Example.class.js
/**
 * @public
 * @class
 */
function Example() {
    //构造函数
}
```

#### 参数

&emsp;&emsp;对于类对象的构造函数传参，我们应使用`@param`以控制实例化时传入的参数。

```javascript
//Example.class.js
/**
 * @public
 * @class
 * @param {string}
 */
function Example(param) {
    //构造函数
}

const intance = new Example(false);//错误的传参会导致报错
const intance = new Example("test");//正确的传参
```

### 方法|Method

&emsp;&emsp;对于方法的声明，我们有三种方式，分别为：原型方法、实例方法[^1]、静态方法，下文会为您逐一讲解。

#### 声明

首先让我们来看看上文中三种方法的声明

```javascript
/**
 * @public
 * @class
 * @param {string}
 */
function Example(param) {
    //实例方法
    this.instanceMethod = function() { }
}

Object.defineProperties(Example.prototype, {
    //原型方法
    prototypeMethod: {
      value: function() { }
    }
})

//静态方法
/**
 * @static
 */
Example.staticMethod = function() { }
```

##### 静态方法

&emsp;&emsp;静态方法在调用时无需将类实例化，如上文例子中，我们可以通过`Example.staticMethod()`来直接调用`staticMethod`方法，而无需`new Example()`。

##### 原型方法与实例方法

&emsp;&emsp;二者都需要将类实例化后才能调用，但是他们之间稍微有一些区别。

|              | **原型方法**                                     | **实例方法**                              |
|-----------|----------------------------------------------|---------------------------------------|
| **定义位置**  | 在构造函数的prototype对象上定义，所有实例通过原型链共享这个方法。        | 在构造函数内部定义，成为每个实例对象的一个属性。              |
| **内存使用**  | 所有实例共享同一个方法，节省内存，特别是当方法体较大或包含大量数据时。          | 每个实例都有自己的方法副本，如果创建很多实例，会占用更多的内存。      |
| **访问方式**  | 通过实例对象访问，但实际调用的是原型链上的函数，例如instance.method()。 | 通过实例对象直接访问，例如instance.method().       |
| **数据封装**  | 通常不用于封装需要特定实例属性的方法，因为它们是共享的。                 | 如果方法内部需要访问或修改实例的私有属性，实例方法可以很好地封装这些行为。 |
| **使用场景**  | 适合那些不需要访问实例属性，或者所有实例都应该有统一行为的方法。             | 适合那些需要针对每个实例有独立状态或行为的方法。              |
| **继承**    | 可以通过原型链继承，子类实例可以访问父类的原型方法。                   | 由于是直接添加到实例上的，它们不会通过原型链继承。             |
| **性能**    | 由于所有实例共享同一个方法，所以性能上通常更优。                     | 如果方法体较大，每个实例都复制一份可能会影响性能。             |
| **修改和更新** | 修改原型方法会影响所有实例，包括已经创建的实例。                     | 修改实例方法只影响当前实例。                        |

### 接口|Implements

&emsp;&emsp;在本插件中，接口被定义为拓展名为`.impl.js`，对于接口对象有以下代码规范。

#### 声明

//TODO

### 继承|Extends

&emsp;&emsp;在JavaScript中，继承的语法略显不同

```javascript
/**
 * @public
 * @class
 * @param {string}
 */
function Example(param) {
    //实例方法
    this.instanceMethod = function() { }
}

Object.defineProperties(Example.prototype, {
    //父类原型方法
    prototypeMethod: {
      value: function() { }
    }
})

/**
 * @public
 * @class
 * @param {string}
 */
function Test(param) {
    //新建子类继承父类，调用父类构造函数
    Example.call(this, param)
}

//与Java不同的是，原型链上的方法也需要手动继承，我们为您提供了一键补全。
Test.prototype = Object.create(Example.prototype, {
    //子类新建原型方法
    newPrototypeMethod: {
      value: function() { }
    },
    //此处将构造函数重新指向，这是不可缺少的
    constructor: {
    value: Test,
    },
})
```

### 修饰符|Modifiers

&emsp;&emsp;我们通过 _**jsdoc**_ 来实现修饰符功能

[^1]: 二者的区别和用法会在下文阐述。