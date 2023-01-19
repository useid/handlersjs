# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [0.13.1](https://github.com/digita-ai/handlersjs/compare/v0.13.0...v0.13.1) (2023-01-12)


### **Bug Fixes**

* return correct vary header ([#218](https://github.com/digita-ai/handlersjs/issues/218)) ([7258c1d](https://github.com/digita-ai/handlersjs/commit/7258c1d1959dd5ca7fe3fc3ff82bf5bba84245ff))



## [0.13.0](https://github.com/digita-ai/handlersjs/compare/v0.12.1...v0.13.0) (2022-12-22)


### **Features**

* add x-powered-by, strict-transport-security and vary header ([#217](https://github.com/digita-ai/handlersjs/issues/217)) ([297898d](https://github.com/digita-ai/handlersjs/commit/297898d5224e86c3abe5924b4f92629b58390193))



### [0.12.1](https://github.com/digita-ai/handlersjs/compare/v0.12.0...v0.12.1) (2022-09-26)


### **Bug Fixes**

* response body parsing ([#211](https://github.com/digita-ai/handlersjs/issues/211)) ([88016c9](https://github.com/digita-ai/handlersjs/commit/88016c9157c534934f22d13ce40ab906831a32d0))



## [0.12.0](https://github.com/digita-ai/handlersjs/compare/v0.11.0...v0.12.0) (2022-09-19)


### **Features**

* make parseBody more robust ([#199](https://github.com/digita-ai/handlersjs/issues/199)) ([e88e5d2](https://github.com/digita-ai/handlersjs/commit/e88e5d265e49a1c4f3f18d105ae566e7007c16fd))


### **Bug Fixes**

* do not remove origin header in cors request handler ([#210](https://github.com/digita-ai/handlersjs/issues/210)) ([f7a7b27](https://github.com/digita-ai/handlersjs/commit/f7a7b2768bac312c6896c3f9bb345baf23412e07))
* set default content-type instead of undefined ([#209](https://github.com/digita-ai/handlersjs/issues/209)) ([ff93983](https://github.com/digita-ai/handlersjs/commit/ff93983b600718ff863045001aee710c16fcb36a))



## [0.11.0](https://github.com/digita-ai/handlersjs/compare/v0.10.0...v0.11.0) (2022-05-24)


### **Features**

* bump versions for componentsjs(-generator) ([#202](https://github.com/digita-ai/handlersjs/issues/202)) ([f4ac28e](https://github.com/digita-ai/handlersjs/commit/f4ac28edfb97bc0ac7df477742ac85f195d51dcd))



## [0.10.0](https://github.com/digita-ai/handlersjs/compare/v0.9.2...v0.10.0) (2022-05-19)


### **Features**

* add console logger to http package ([#186](https://github.com/digita-ai/handlersjs/issues/186)) ([1e6280d](https://github.com/digita-ai/handlersjs/commit/1e6280de97c3df9844f0ce7165b5533b3f81a5ea))


### **Bug Fixes**

* can't return false as a body ([#196](https://github.com/digita-ai/handlersjs/issues/196)) ([ad0d662](https://github.com/digita-ai/handlersjs/commit/ad0d6627ceee9c9abf010672b827bc09304e71d0))



### [0.9.2](https://github.com/digita-ai/handlersjs/compare/v0.9.1...v0.9.2) (2022-04-22)


### **Bug Fixes**

* ignore charset when parsing json body ([#193](https://github.com/digita-ai/handlersjs/issues/193)) ([aa82b92](https://github.com/digita-ai/handlersjs/commit/aa82b9244ee3ae79eb03727d4100192c772ab8a5))



### [0.9.1](https://github.com/digita-ai/handlersjs/compare/v0.9.0...v0.9.1) (2022-04-21)

**Note:** Version bump only for package @digita-ai/handlersjs-http





## [0.9.0](https://github.com/digita-ai/handlersjs/compare/v0.8.6...v0.9.0) (2022-04-08)


### **Features**

* create basic StatusHandler ([#190](https://github.com/digita-ai/handlersjs/issues/190)) ([9c75ad7](https://github.com/digita-ai/handlersjs/commit/9c75ad7aef22920f9683b056c4066957e5e816dc))



### [0.8.6](https://github.com/digita-ai/handlersjs/compare/v0.8.5...v0.8.6) (2022-04-07)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.8.5](https://github.com/digita-ai/handlersjs/compare/v0.8.4...v0.8.5) (2022-03-02)


### **Bug Fixes**

* bump componentsjs with temp fixes  ([47ba52b](https://github.com/digita-ai/handlersjs/commit/47ba52b0b9d7455528a209e17842d24464aa6295))



### [0.8.4](https://github.com/digita-ai/handlersjs/compare/v0.8.3...v0.8.4) (2022-02-28)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.8.3](https://github.com/digita-ai/handlersjs/compare/v0.8.2...v0.8.3) (2022-02-18)


### **Bug Fixes**

* error handler signature ([#183](https://github.com/digita-ai/handlersjs/issues/183)) ([1db118d](https://github.com/digita-ai/handlersjs/commit/1db118d2821dad5df7098de762beb9fd9c297252))



### [0.8.2](https://github.com/digita-ai/handlersjs/compare/v0.8.1...v0.8.2) (2022-02-15)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.8.1](https://github.com/digita-ai/handlersjs/compare/v0.8.0...v0.8.1) (2022-02-15)

**Note:** Version bump only for package @digita-ai/handlersjs-http





## [0.8.0](https://github.com/digita-ai/handlersjs/compare/v0.7.1...v0.8.0) (2022-02-11)


### **Features**

* refactor handler architecture ([#136](https://github.com/digita-ai/handlersjs/issues/136)) ([ee3e464](https://github.com/digita-ai/handlersjs/commit/ee3e4643e0c2cf281cca26dfdd8dc9fff4a6ca58))



### [0.7.1](https://github.com/digita-ai/handlersjs/compare/v0.7.0...v0.7.1) (2022-01-23)

**Note:** Version bump only for package @digita-ai/handlersjs-http





## [0.7.0](https://github.com/digita-ai/handlersjs/compare/v0.6.0...v0.7.0) (2022-01-22)


### **Features**

* handlersjs-logging ([#137](https://github.com/digita-ai/handlersjs/issues/137)) ([cf101f0](https://github.com/digita-ai/handlersjs/commit/cf101f02545ca7307e691dc12f69bdc4ad8b29c8))
* improve OPTIONS requests ([#144](https://github.com/digita-ai/handlersjs/issues/144)) ([7ac1cd0](https://github.com/digita-ai/handlersjs/commit/7ac1cd0b5036396f3b8676bc571d0eba70fbe817))
* logger factories ([#172](https://github.com/digita-ai/handlersjs/issues/172)) ([fe427f7](https://github.com/digita-ai/handlersjs/commit/fe427f73ff5aded262d09b4cd33933279f7e95ae)), closes [#145](https://github.com/digita-ai/handlersjs/issues/145) [#146](https://github.com/digita-ai/handlersjs/issues/146) [#147](https://github.com/digita-ai/handlersjs/issues/147) [#148](https://github.com/digita-ai/handlersjs/issues/148) [#149](https://github.com/digita-ai/handlersjs/issues/149) [#150](https://github.com/digita-ai/handlersjs/issues/150) [#151](https://github.com/digita-ai/handlersjs/issues/151) [#152](https://github.com/digita-ai/handlersjs/issues/152) [#153](https://github.com/digita-ai/handlersjs/issues/153) [#154](https://github.com/digita-ai/handlersjs/issues/154) [#155](https://github.com/digita-ai/handlersjs/issues/155) [#156](https://github.com/digita-ai/handlersjs/issues/156) [#157](https://github.com/digita-ai/handlersjs/issues/157) [#158](https://github.com/digita-ai/handlersjs/issues/158) [#159](https://github.com/digita-ai/handlersjs/issues/159) [#160](https://github.com/digita-ai/handlersjs/issues/160) [#161](https://github.com/digita-ai/handlersjs/issues/161) [#162](https://github.com/digita-ai/handlersjs/issues/162) [#163](https://github.com/digita-ai/handlersjs/issues/163) [#164](https://github.com/digita-ai/handlersjs/issues/164) [#165](https://github.com/digita-ai/handlersjs/issues/165) [#166](https://github.com/digita-ai/handlersjs/issues/166) [#167](https://github.com/digita-ai/handlersjs/issues/167) [#168](https://github.com/digita-ai/handlersjs/issues/168) [#169](https://github.com/digita-ai/handlersjs/issues/169) [#170](https://github.com/digita-ai/handlersjs/issues/170) [#171](https://github.com/digita-ai/handlersjs/issues/171)



## [0.6.0](https://github.com/digita-ai/handlersjs/compare/v0.5.2...v0.6.0) (2021-12-12)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.5.2](https://github.com/digita-ai/handlersjs/compare/v0.5.1...v0.5.2) (2021-11-22)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.5.1](https://github.com/digita-ai/handlersjs/compare/v0.5.0...v0.5.1) (2021-11-17)


### **Features**

* export cors options as interface ([#127](https://github.com/digita-ai/handlersjs/issues/127)) ([1a9bb56](https://github.com/digita-ai/handlersjs/commit/1a9bb56a1454d1dd416fde9f48b921f39b368bcf))



## [0.5.0](https://github.com/digita-ai/handlersjs/compare/v0.4.7...v0.5.0) (2021-11-17)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.4.7](https://github.com/digita-ai/handlersjs/compare/v0.4.6...v0.4.7) (2021-11-15)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.4.6](https://github.com/digita-ai/handlersjs/compare/v0.4.4...v0.4.6) (2021-11-04)


### **Bug Fixes**

* catch observable httperrors ([#116](https://github.com/digita-ai/handlersjs/issues/116)) ([4b4a8bb](https://github.com/digita-ai/handlersjs/commit/4b4a8bba8c75d053a5935bf99ef491a056bd3c7e))



### [0.4.5](https://github.com/digita-ai/handlersjs/compare/v0.4.4...v0.4.5) (2021-11-04)


### **Bug Fixes**

* catch observable httperrors ([#116](https://github.com/digita-ai/handlersjs/issues/116)) ([4b4a8bb](https://github.com/digita-ai/handlersjs/commit/4b4a8bba8c75d053a5935bf99ef491a056bd3c7e))



### [0.4.4](https://github.com/digita-ai/handlersjs/compare/v0.4.3...v0.4.4) (2021-10-06)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.4.3](https://github.com/digita-ai/handlersjs/compare/v0.4.2...v0.4.3) (2021-10-05)


### **Bug Fixes**

* add-error-header-object ([#115](https://github.com/digita-ai/handlersjs/issues/115)) ([9b490e8](https://github.com/digita-ai/handlersjs/commit/9b490e890966c4073eb17ae43a5852d88e14c11f))



### [0.4.2](https://github.com/digita-ai/handlersjs/compare/v0.4.1...v0.4.2) (2021-10-05)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.4.1](https://github.com/digita-ai/handlersjs/compare/v0.4.0...v0.4.1) (2021-09-29)


### **Features**

* write cors handler tests ([#51](https://github.com/digita-ai/handlersjs/issues/51)) ([feb5967](https://github.com/digita-ai/handlersjs/commit/feb596741449b84d35d2aca6110a06e79bb139a6))



## [0.4.0](https://github.com/digita-ai/handlersjs/compare/v0.3.5...v0.4.0) (2021-09-23)


### **Bug Fixes**

* buffer resp body + form-urlencoded req body ([#108](https://github.com/digita-ai/handlersjs/issues/108)) ([79c9c12](https://github.com/digita-ai/handlersjs/commit/79c9c1283463eabc0c173cdf9ba829e88f959b7b))
* check whether asset path is absolute ([#109](https://github.com/digita-ai/handlersjs/issues/109)) ([de73ad7](https://github.com/digita-ai/handlersjs/commit/de73ad7f3dfe0e71ff06687b6355a6b901e8986f))



### [0.3.5](https://github.com/digita-ai/handlersjs/compare/v0.3.4...v0.3.5) (2021-09-02)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.3.4](https://github.com/digita-ai/handlersjs/compare/v0.3.3...v0.3.4) (2021-09-01)

**Note:** Version bump only for package @digita-ai/handlersjs-http





### [0.3.3](https://github.com/digita-ai/handlersjs/compare/v0.3.2...v0.3.3) (2021-08-11)


### **Bug Fixes**

* unhandled promise syncservice ([#103](https://github.com/digita-ai/handlersjs/issues/103)) ([eec9fe2](https://github.com/digita-ai/handlersjs/commit/eec9fe253d53a25aa5ba4cafda1dfb08668cb6c4))



### [0.3.2](https://github.com/digita-ai/handlersjs/compare/v0.3.1...v0.3.2) (2021-08-05)


### **Features**

* adjust sync service to use lists ([#98](https://github.com/digita-ai/handlersjs/issues/98)) ([6c3c9f3](https://github.com/digita-ai/handlersjs/commit/6c3c9f3ecdaa23b743af50c8bb73c2b349e3b6a2))



### [0.3.1](https://github.com/digita-ai/handlersjs/compare/v0.3.0...v0.3.1) (2021-08-04)


### **Features**

* export json-store-handler ([#96](https://github.com/digita-ai/handlersjs/issues/96)) ([64a1b3e](https://github.com/digita-ai/handlersjs/commit/64a1b3e1987646052424178deb01d1a6d2f8cd37))



## [0.3.0](https://github.com/digita-ai/handlersjs/compare/v0.2.3...v0.3.0) (2021-08-04)


### **Features**

* endpoint for syncservice ([#94](https://github.com/digita-ai/handlersjs/issues/94)) ([54abbc9](https://github.com/digita-ai/handlersjs/commit/54abbc9259d56a2e68ae40b801d977b49de4b232))
* json-store-handler ([#85](https://github.com/digita-ai/handlersjs/issues/85)) ([8c7f362](https://github.com/digita-ai/handlersjs/commit/8c7f362c33b49d2ac6b8a838ac1562b244dee815))
* make sync-service a handler ([#92](https://github.com/digita-ai/handlersjs/issues/92)) ([89bc33f](https://github.com/digita-ai/handlersjs/commit/89bc33fc62a6a8385f51e61c5a48d43f30d1c1c9))
* scheduler daemon ([#82](https://github.com/digita-ai/handlersjs/issues/82)) ([5063010](https://github.com/digita-ai/handlersjs/commit/5063010e2c822aa3de200499894045d84b48df69))
* storage ([#79](https://github.com/digita-ai/handlersjs/issues/79)) ([72a9b08](https://github.com/digita-ai/handlersjs/commit/72a9b08dc1cfb83df8b9e58df3dc5258736b8136))
* sync service ([#86](https://github.com/digita-ai/handlersjs/issues/86)) ([5abcd08](https://github.com/digita-ai/handlersjs/commit/5abcd0854f5794b471ef6cb157993399cbff9b9f))



### [0.2.3](https://github.com/digita-ai/handlersjs/compare/v0.2.2...v0.2.3) (2021-06-24)


### **Features**

* add support for multiple routes with the same path and improve body parsing ([#68](https://github.com/digita-ai/handlersjs/issues/68)) ([679d62d](https://github.com/digita-ai/handlersjs/commit/679d62dde59a9eedec8bef1826cd9a1064076f8d))



### [0.2.2](https://github.com/digita-ai/handlersjs/compare/v0.2.1...v0.2.2) (2021-06-17)


### **Features**

* adjustments to work with api ([#67](https://github.com/digita-ai/handlersjs/issues/67)) ([76806d7](https://github.com/digita-ai/handlersjs/commit/76806d7abb4ddaf6fe68ae58f47b1260cfd0650c))
* parse request body if application json ([#66](https://github.com/digita-ai/handlersjs/issues/66)) ([61ec945](https://github.com/digita-ai/handlersjs/commit/61ec94547e1ba2c9105a25e5484ae0bced13ee24))



### [0.2.1](https://github.com/digita-ai/handlersjs/compare/v0.2.0...v0.2.1) (2021-05-28)


### **Bug Fixes**

* don't calculate content length when response body is empty ([#60](https://github.com/digita-ai/handlersjs/issues/60)) ([0caf32c](https://github.com/digita-ai/handlersjs/commit/0caf32c9271889b6dbacf643ea6f07c2ff3f56a0))



## [0.2.0](https://github.com/digita-ai/handlersjs/compare/v0.1.5...v0.2.0) (2021-05-27)


### **Features**

* better error handling ([#55](https://github.com/digita-ai/handlersjs/issues/55)) ([12f0e78](https://github.com/digita-ai/handlersjs/commit/12f0e78dc5561cc4f6cc6434830cb8528be1be6d))
* default handler to match any route ([#56](https://github.com/digita-ai/handlersjs/issues/56)) ([b358184](https://github.com/digita-ai/handlersjs/commit/b358184d2ad16f364a3dd4f9c4456f3ced1b3cf9))
* even better error handling ([#59](https://github.com/digita-ai/handlersjs/issues/59)) ([3a325c2](https://github.com/digita-ai/handlersjs/commit/3a325c2d231e4c3276d7fbdceab6c7d668279219))
* set content-length of the response ([#57](https://github.com/digita-ai/handlersjs/issues/57)) ([013993f](https://github.com/digita-ai/handlersjs/commit/013993f97191ef608d43e57abf4a82dd7b41d83d))



### [0.1.5](https://github.com/digita-ai/handlersjs/compare/v0.1.4...v0.1.5) (2021-05-05)


### **Features**

* typescript settings extend from config repo ([#50](https://github.com/digita-ai/handlersjs/issues/50)) ([9f446ae](https://github.com/digita-ai/handlersjs/commit/9f446ae2ef8133e52539be0ccaf947c911396ae4))


### **Bug Fixes**

* add HttpMethods to public-api ([790a18a](https://github.com/digita-ai/handlersjs/commit/790a18aa9d5c3ac43ba1cc1939ed11a8ecd04bf9))



### [0.1.4](https://github.com/digita-ai/handlersjs/compare/v0.1.3...v0.1.4) (2021-04-29)


### **Bug Fixes**

* hotfix for componentsjs ([4704751](https://github.com/digita-ai/handlersjs/commit/4704751f8cff35e8ecefb0986987257c9c6f793b))



### [0.1.3](https://github.com/digita-ai/handlersjs/compare/v0.1.2...v0.1.3) (2021-04-29)


### **Features**

* ignore q-factor in static asset handler ([#45](https://github.com/digita-ai/handlersjs/issues/45)) ([f4708c6](https://github.com/digita-ai/handlersjs/commit/f4708c60db3a0379fff4e151296e4e4d26767ff9))
* preresponse handler improvements ([#48](https://github.com/digita-ai/handlersjs/issues/48)) ([64cb55c](https://github.com/digita-ai/handlersjs/commit/64cb55cea88f0139483143685ab2609624010644))
* three cors handler changes ([#46](https://github.com/digita-ai/handlersjs/issues/46)) ([46fcbee](https://github.com/digita-ai/handlersjs/commit/46fcbee1c07a887ce6a7aab17e324a32e20c9d1a))



### [0.1.2](https://github.com/digita-ai/handlersjs/compare/v0.1.1...v0.1.2) (2021-04-26)


### **Bug Fixes**

* do not return undefined allowed headers ([49674a9](https://github.com/digita-ai/handlersjs/commit/49674a9d3faed75690819535dfae01e35de48234))



### [0.1.1](https://github.com/digita-ai/handlersjs/compare/v0.1.0...v0.1.1) (2021-04-26)


### **Bug Fixes**

* temporary body type revert ([360f7dd](https://github.com/digita-ai/handlersjs/commit/360f7dd84967cd65cbadb287a6b9e24422e6c842))



## 0.1.0 (2021-04-23)


### **Features**

* add allowed methods to response when method not allowed ([#34](https://github.com/digita-ai/handlersjs/issues/34)) ([a0cf357](https://github.com/digita-ai/handlersjs/commit/a0cf357d76fa5f68ed27ef295fcf0408614f550a))
* allow body type and make body optional ([#33](https://github.com/digita-ai/handlersjs/issues/33)) ([3ba052d](https://github.com/digita-ai/handlersjs/commit/3ba052deb1cde1f82c1395c6d1e96856d78e22cd))
* cors handler with allow header ([#35](https://github.com/digita-ai/handlersjs/issues/35)) ([1310433](https://github.com/digita-ai/handlersjs/commit/13104330f244c5fe9db74c44684cf1f5b811f790))

### 0.0.11 (2021-04-15)


### **Features**

* use DOM URL instead of path & query ([eb12064](https://github.com/digita-ai/handlersjs/commit/eb120643bfd71f84e49f42a9445b4b055dea4f15))

### 0.0.10 (2021-04-15)


### **Bug Fixes**

* make response optional in asset handler ([1a2f937](https://github.com/digita-ai/handlersjs/commit/1a2f93706f970bb0074520d0ea0bd1e710b6f9cc))

### 0.0.9 (2021-04-15)

### 0.0.8 (2021-04-15)


### **Features**

* dynamic routing with full path ([#23](https://github.com/digita-ai/handlersjs/issues/23)) ([a563c4a](https://github.com/digita-ai/handlersjs/commit/a563c4a7aa0d5cab7c4508cf47f9a2179a704d7e))
* relocate server structure ([#17](https://github.com/digita-ai/handlersjs/issues/17)) ([674c117](https://github.com/digita-ai/handlersjs/commit/674c117db1317b70701be4b243b95b94cd4dba10))
* return useful errors ([#21](https://github.com/digita-ai/handlersjs/issues/21)) ([367347d](https://github.com/digita-ai/handlersjs/commit/367347d2eb717db1ab5e195a5311b3b792505edb))

### 0.0.7 (2021-04-07)


### **Features**

* serve multiple assets through a file pattern ([44daa44](https://github.com/digita-ai/handlersjs/commit/44daa44c77f985f69e78926b56332db3da627306))

### 0.0.6 (2021-03-31)


### **Features**

* url in request ([84a7239](https://github.com/digita-ai/handlersjs/commit/84a7239b980c631ef60511c40fd8ba0858bc433e))


### **Bug Fixes**

* optional intermediate output in subclasses ([0792b56](https://github.com/digita-ai/handlersjs/commit/0792b56fd6e8297a173275dc7863eedf1afc392e))

### 0.0.5 (2021-03-31)


### **Features**

* make handler's intermediate output param & context's router field optional ([e59ccd5](https://github.com/digita-ai/handlersjs/commit/e59ccd585502a22588e0c28f57c171102626a392))

### 0.0.4 (2021-03-29)


### **Features**

* add support for http handlers ([#5](https://github.com/digita-ai/handlersjs/issues/5)) ([a51a4d6](https://github.com/digita-ai/handlersjs/commit/a51a4d63505c6816b72959881298f6e3897a0b45))



## [0.0.11](https://github.com/digita-ai/handlersjs/compare/0.0.10...0.0.11) (2021-04-15)


### Features

* use DOM URL instead of path & query ([eb12064](https://github.com/digita-ai/handlersjs/commit/eb120643bfd71f84e49f42a9445b4b055dea4f15))





## [0.0.10](https://github.com/digita-ai/handlersjs/compare/0.0.9...0.0.10) (2021-04-15)


### Bug Fixes

* make response optional in asset handler ([1a2f937](https://github.com/digita-ai/handlersjs/commit/1a2f93706f970bb0074520d0ea0bd1e710b6f9cc))





## [0.0.9](https://github.com/digita-ai/handlersjs/compare/0.0.8...0.0.9) (2021-04-15)

**Note:** Version bump only for package @digita-ai/handlersjs-http





## [0.0.8](https://github.com/digita-ai/handlersjs/compare/0.0.7...0.0.8) (2021-04-15)


### Features

* dynamic routing with full path ([#23](https://github.com/digita-ai/handlersjs/issues/23)) ([a563c4a](https://github.com/digita-ai/handlersjs/commit/a563c4a7aa0d5cab7c4508cf47f9a2179a704d7e))
* relocate server structure ([#17](https://github.com/digita-ai/handlersjs/issues/17)) ([674c117](https://github.com/digita-ai/handlersjs/commit/674c117db1317b70701be4b243b95b94cd4dba10))
* return useful errors ([#21](https://github.com/digita-ai/handlersjs/issues/21)) ([367347d](https://github.com/digita-ai/handlersjs/commit/367347d2eb717db1ab5e195a5311b3b792505edb))





## [0.0.7](https://github.com/digita-ai/handlersjs/compare/0.0.6...0.0.7) (2021-04-07)


### Features

* serve multiple assets through a file pattern ([44daa44](https://github.com/digita-ai/handlersjs/commit/44daa44c77f985f69e78926b56332db3da627306))





## [0.0.6](https://github.com/digita-ai/handlersjs/compare/0.0.5...0.0.6) (2021-03-31)


### Bug Fixes

* optional intermediate output in subclasses ([0792b56](https://github.com/digita-ai/handlersjs/commit/0792b56fd6e8297a173275dc7863eedf1afc392e))


### Features

* url in request ([84a7239](https://github.com/digita-ai/handlersjs/commit/84a7239b980c631ef60511c40fd8ba0858bc433e))





## [0.0.5](https://github.com/digita-ai/handlersjs/compare/0.0.4...0.0.5) (2021-03-31)


### Features

* make handler's intermediate output param & context's router field optional ([e59ccd5](https://github.com/digita-ai/handlersjs/commit/e59ccd585502a22588e0c28f57c171102626a392))





## [0.0.4](https://github.com/digita-ai/handlersjs/compare/0.0.3...0.0.4) (2021-03-29)


### Features

* add support for http handlers ([#5](https://github.com/digita-ai/handlersjs/issues/5)) ([a51a4d6](https://github.com/digita-ai/handlersjs/commit/a51a4d63505c6816b72959881298f6e3897a0b45))
