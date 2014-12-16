# Wildstar "Armory" project ##
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/ws-armory/ws-armory.github.io/~chat)

## Summary ##
* [Overview](#overview)
* [Developer Notes](#developer-notes)
  * [How does it work](#how-does-it-work)
  * [TL;DR](#tldr)
  * [The query string](#the-query-string)
  * [Page template](#page-template)
  * [URL shortening](#url-shortening)
  * [Application backend](#application-backend)
* [Contact](#contact)

## Overview ##

The main idea of this project is to provide a way for [Wildstar](http://wildstar-online.com/) players to share a link to their equipment (to post it on forums or in a guide for example).

The [website](http://ws-armory.github.io/) is used for two things: visualize the equipments and get a short link for sharing purpose.

It is possible to get a link to your equipment in-game using the [Armory addon](http://http://curse.com/project/225711) for Wildstar. It is also possible to build your own list ([more](https://github.com/ws-armory/ws-armory.github.io#building-custom-lists)).


## Developer Notes ##

### How does it work ###

Wildstar in-game API exposes unique _#_ to reference each objects, information about this objects can be found in different online databases such as [Jabbithole](http://www.jabbithole.com).

Items names and pretty tooltips are generated using the [Jabbithole](http://www.jabbithole.com) tooltips JavaScript [API](http://www.jabbithole.com/pages/tooltips) which takes this items unique _#_ as parameter.

The in-game addon gather couples of (_slot_id_, _item_id_) then generates a link to the website based on this couples.

The [goo.gl](http://goo.gl/) url shortening API is used to generate short links.

Everything is done a static way using JavaScript.


### TL;DR ###
```http
GET ws-armory.github.io/?0=1234&16=4321
```
gives
```html
<section id="main">
  <table id="items">
    <thead>...<thead>
    <tbody>
      <tr><td class="slot">Chest</td><td class="item"><a href="http://jabbithole.com/items/1234">Chest name</a></td></tr>
      <tr><td class="slot">Weapon</td><td class="item"><a href="http://jabbithole.com/items/4321">Weapon name</a></td></tr>
    </tbody>
  </table>
</section>
```
and
```
http://ws-armory.github.io/v?XYZXY
```


### The query string ###

The query string of the page is composed by key-values couples such as (_slot_, _item_id_). The _slot_ key can either be a slot _#_ or a slot name.

If a slot _#_ is given the slot will be named following this table:

| id | Name              | id | Name              |
|----|-------------------|----|-------------------|
| 0  | Chest             | 8  | Support System    |
| 1  | Legs              | 9  | Key               |
| 2  | Head              | 10 | Implant           |
| 3  | Shoulder          | 11 | Gadget            |
| 4  | Feet              | 15 | Energy Shield     |
| 5  | Hands             | 16 | Weapon            |
| 6  | Tool              | 17 | Bag               |
| 7  | Weapon Attachment |    |                   |

If the slot _#_ is not found in the table, it's keeping it's orinal value (42 will be kept as 42).

Parameters are gathered using JavaScript, the page is then built dynamically.

Items _#_ are then converted to item names using the [Jabbithole](http://www.jabbithole.com) tooltips JavaScript API. This API also add a fancy tooltip widget (on mouse hover).

Here is some examples of valid links to the equipment with id `#1234` (which is a weapon):
* http://ws-armory.github.io/?16=1234
* http://ws-armory.github.io/index?16=1234
* http://ws-armory.github.io/index.html?16=1234

#### Building custom lists ####

##### Specifying slot names #####
~~You can build lists with custom slot names by specifying names for slots as key of the query string~~ (Feature was removed)

##### Several items for the same slot #####
It is possible to give several items for the same slot by specifying the slot name/_#_ as a key several times in the query string. In the view, a number will be add to the slot name (_Weapon [1]_, _Weapon [2]_, ...).

Here are some samples of lists with several items for the same slot:
* http://ws-armory.github.io/?16=1234&16=4321&16=9999&2=1111&3=2222
* http://ws-armory.github.io/?10=1234&10=4321&10=9999

##### Giving lists a title #####
The `title` key of the query string can be used to specify a title for a list.

Here are some examples of entitled lists:
* http://ws-armory.github.io/?10=1234&10=4321&10=9999&title=My+Character%40Realm+-+Class+%5B50%5D
* http://ws-armory.github.io/?10=1234&10=4321&10=9999&title=Medic+Healing+Build


### Page template ###

The (_slot_,_item_) couples will be output in a table following this structure:

```html
<section id="main">
  <table id="items">
    <thead>...<thead>
    <tbody>
      <tr><td class="slot">SLOT_NAME</td><td class="item"><a href="#LINK">ITEM_NAME</a></td></tr>
      <tr>...</tr>
      ...
    </tbody>
  </table>
</section>
```

The _table_ (in the section `main`) have the id `items`, slot name's _td_ will have the class `slot`, item ones will have the class `item`.


### URL shortening ###

The [goo.gl](http://goo.gl/) url shortening [API](https://developers.google.com/url-shortener/) is used to generate short links.

You can see that links does have the `goo.gl/XYZXY` format but `ws-armory.github.io/v?XYZXY`, it's mainly for security reasons: a `goo.gl` link can point to anything, ws-armory links can only reference ws-armory pages.

This is done this way:

* Creating an ID

The _Share_ button is pressed and the JavaScript library generates a link based on the URL of the current page: `http://ws-armory.github.io/?16=12345&14=12346` gives `http://goo.gl/XYZXY` that gives `http://ws-armory.github.io/v?XYZXY`.

* Loading an ID

When the _v.html_ page gets a request, the JavaScript library first look for the long version of the url: `http://ws-armory.github.io/v?XYZXY` gives `http://goo.gl/ + XYZXY` that gives `http://ws-armory.github.io/?16=12345&14=12346`.

It's then extract the query string of the URL and redirect to the items page: `http://ws-armory.github.io/?16=12345&14=12346` gives `?16=12345&14=12346` that is used to get `http://ws-armory.github.io/ + ?16=12345&14=12346` for the redirection.

Doing such a thing avoid users to redirect on non-armory pages using an ws-armory link.


### Application Backend ###
For the moment everything on the website is done a static way using HTML and JavaScript, there is no backend (such as J2EE, PHP, RoR, ...).

I would like to keep it working like this as much time as possible not to have to deal with web hosting and service maintenance.

Nevertheless, if think of a killer feature and you really need to base it on a backend-oriented solution, we can [discuss](https://gitter.im/ws-armory/ws-armory.github.io/~chat) about it, I'm open to any suggestions that will allow to improve the website.


## Contact ##
* [Armory chat room](https://gitter.im/ws-armory/chat/~chat)
* [Website chat room](https://gitter.im/ws-armory/ws-armory.github.io/~chat)
* [Bug report and Feature request](https://github.com/ws-armory/ws-armory.github.io/issues)
* [Private message](https://github.com/olbat)
