// construct 2 date, use > to see if return true or false
var date1 = new Date(2021, 9, 19);
var date2 = new Date(2021, 9, 21);
// console.log(date1<date2) //true
// console.log(date1>date2) //false
// console.log(date1-date2); //-172800000
// console.log(typeof(date1-date2)); //number

var listDate = [];
var obj1 = {
    "title": "Hello world",
    "time": new Date(2021, 9, 19),
    "tag": ["cat", "dog"]
};
var obj2 = {
    "title": "Hello world",
    "time": new Date(2021, 9, 20),
    "tag": ["cat", "dog"]
};
var obj3 = {
    "title": "Hello world",
    "time": new Date(2021, 9, 21),
    "tag": ["cat", "dog"]
};
listDate.push(obj3);
listDate.push(obj1);
listDate.push(obj2);

listDate.sort(function(a, b){return a.time - b.time});
console.log(listDate);
for (let item of listDate) {
    console.log(item);
}
// {title: 'Hello world', time: Tue Oct 19 2021 00:00:00 GMT+0700 (インドシナ時間), tag: Array(2)}
// {title: 'Hello world', time: Wed Oct 20 2021 00:00:00 GMT+0700 (インドシナ時間), tag: Array(2)}
// {title: 'Hello world', time: Thu Oct 21 2021 00:00:00 GMT+0700 (インドシナ時間), tag: Array(2)}
