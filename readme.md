## refactor and debug code :

-- What had been changed style refacor

using async and await function we are replace callback function

## before style

```
db.query(sql, (error , result) => {

    --- call back function
})


```

## what had been refactor style code clean readable

```
db.query(sql, async (req, res) => {

   const result = await db.query(sql);
});

```

## 3 add try catch to prevent

try {

}catch (error) {

hanlde error
}

## 4. mysql2/promise

```
const mysql = require('mysql2/promise');

```

5. using pool better connection cause pool it is handle multiple request from client

mysql2.createPool(

    --- implemenation

);

## 🔥 This is now your level:

what i had been learn fom crud api design api about e-commerce mini database design mock to testing

contains tables as like products and category row or field

- Review js ES6++

1/ destrcutring object or array object
2/ sql refer to DQL as like crud operation system
3/ async and await
4/ join tables
