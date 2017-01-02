/// <reference path="angular.min.js" />
var mayApp = angular.module("ServiceClient", ["ngRoute", "ui.bootstrap"])                                  
                                   .config(function ($routeProvider, $locationProvider) {
                                       $routeProvider.caseInsensitiveMatch = true;
                                       $routeProvider
                                           .when("/home", {
                                               templateUrl: "home.html",
                                               controller: "homeController"
                                           })
                                            .when("/ProductByCat/:id", {
                                                templateUrl: "ProductByCat.html",
                                                controller: "ProductByCatController"
                                            })
                                            .when("/ProductBySubCat/:id", {
                                                templateUrl: "ProductBySubCat.html",
                                                controller: "ProductBySubCatController"
                                            })
                                           .when("/OtherProduct", {
                                               templateUrl: "OtherProduct.html",
                                               controller: "OtherProductController"
                                           })
                                           .when("/ProductDetail/:id", {
                                               templateUrl: "ProductDetail.html",
                                               controller: "ProductDetailController"
                                           })
                                          .when("/cart", {
                                              templateUrl: "cart.html",
                                              controller: "cartController"
                                          })
                                           .when("/Thanhtoan", {
                                               templateUrl: "Thanhtoan.html",
                                               controller: "ThanhtoanController"
                                           })
                                            .when("/KhachHang", {
                                                templateUrl: "KhachHang.html",
                                                controller: "KhachHangController"
                                            })
                                           .otherwise({
                                               redirectTo: "/home"
                                           })
                                       $locationProvider.html5Mode(true)
                                   })
                                    .directive("passwordVerify", function() {
                                        return {
                                            require: "ngModel",
                                            scope: {
                                                passwordVerify: '='
                                            },
                                            link: function(scope, element, attrs, ctrl) {
                                                scope.$watch(function() {
                                                    var combined;

                                                    if (scope.passwordVerify || ctrl.$viewValue) {
                                                        combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
                                                    }                    
                                                    return combined;
                                                }, function(value) {
                                                    if (value) {
                                                        ctrl.$parsers.unshift(function(viewValue) {
                                                            var origin = scope.passwordVerify;
                                                            if (origin !== viewValue) {
                                                                ctrl.$setValidity("passwordVerify", false);
                                                                return undefined;
                                                            } else {
                                                                ctrl.$setValidity("passwordVerify", true);
                                                                return viewValue;
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        };
                                    })
                                    .factory("LoginService", function ($http, SessionService) {
                                        return {
                                            Login: function (username, password) {
                                             return $http({
                                                    method: 'POST',
                                                    url: 'http://localhost:4443/login',
                                                    data: { 'UserName': username, 'PassWord': password }
                                                })
                                            },
                                            Loguot: function () {
                                                SessionService.destroy("username");
                                                SessionService.destroy("id");
                                            },
                                            isloggedin: function () {
                                                if (SessionService.get("username"))
                                                    return true;
                                            },
                                            Register: function (username, password) {
                                                
                                                return $http({
                                                    method: 'POST',
                                                    url: 'http://localhost:4443/api/KhachHang',
                                                    data: { 'UserName': username, 'PassWord': password }
                                                })
                                            }
                                        }
                                    })
                                   .factory("CartService", function (SessionService) {
                                       var sanphamgiohang = [];
                                       if (!SessionService.get("TongSPGioHang"))
                                       {
                                           SessionService.set("TongSPGioHang", 0)
                                       }
                                       if (!SessionService.get("TongTienGioHang")) {
                                           SessionService.set("TongTienGioHang", 0)
                                       }
                                       if (SessionService.get("AllSPGioHang")) {
                                           sanphamgiohang = JSON.parse(SessionService.get("AllSPGioHang"))
                                       }
                                       var tongsanpham = parseInt(SessionService.get("TongSPGioHang"));
                                       var tongtien = parseInt(SessionService.get("TongTienGioHang"));
                                       return {
                                           AddtoCart: function (id,tensp,gia,hinh) {
                                               var flag = 0;
                                               for(i=0;i<sanphamgiohang.length;i++)
                                               {
                                                   if (id == sanphamgiohang[i].id) {
                                                       tongtien -= sanphamgiohang[i].soluong * sanphamgiohang[i].gia
                                                       sanphamgiohang[i].soluong += 1;
                                                       sanphamgiohang[i].soluongcu += 1;
                                                       flag = 1;
                                                       tongsanpham += 1;
                                                       tongtien += sanphamgiohang[i].soluong * sanphamgiohang[i].gia
                                                       break;
                                                   }
                                               }
                             
                                               if(flag==0)
                                               {
                                                   sanphamgiohang.push({ id: id, Tensanpham: tensp, gia: gia, HinhAnh: hinh, soluong: 1, soluongcu: 1 })
                                                   tongsanpham += 1;
                                                   tongtien = parseInt(tongtien) + parseInt(gia)
                                               }
                                               SessionService.set("AllSPGioHang", JSON.stringify(sanphamgiohang))
                                               SessionService.set("TongSPGioHang", tongsanpham)
                                               SessionService.set("TongTienGioHang", tongtien)
                                           },
                                           edit: function (id) {
                                               for(i=0;i<sanphamgiohang.length;i++)
                                               {
                                                   if(id==sanphamgiohang[i].id)
                                                   {
                                                     
                                                           tongtien -= sanphamgiohang[i].soluongcu * sanphamgiohang[i].gia
                                                           tongsanpham -= sanphamgiohang[i].soluongcu;

                                                           tongsanpham = tongsanpham + parseInt(sanphamgiohang[i].soluong)
                                                           tongtien += sanphamgiohang[i].soluong * sanphamgiohang[i].gia;
                                                           sanphamgiohang[i].soluongcu = sanphamgiohang[i].soluong;
                                                       
                                                       break;
                                                   }
                                               }
                                               SessionService.set("AllSPGioHang", JSON.stringify(sanphamgiohang))
                                               SessionService.set("TongSPGioHang", tongsanpham)
                                               SessionService.set("TongTienGioHang", tongtien)
                                           },
                                           deletecart: function (id) {
                                               for(i=0;i<sanphamgiohang.length;i++)
                                               {
                                                   if(id==sanphamgiohang[i].id)
                                                   {
                                                       tongsanpham = tongsanpham - parseInt(sanphamgiohang[i].soluong);
                                                       tongtien -= sanphamgiohang[i].soluong * sanphamgiohang[i].gia;
                                                       sanphamgiohang.splice(i, 1);
                                                       break
                                                   }
                                               }
                                               SessionService.set("AllSPGioHang", JSON.stringify(sanphamgiohang))
                                               SessionService.set("TongSPGioHang", tongsanpham)
                                               SessionService.set("TongTienGioHang", tongtien)
                                           },
                                           tienMoiSP: function (id) {
                                               var tongtienmoisp = 0;
                                               for (i = 0; i < sanphamgiohang.length; i++) {
                                                   if (id == sanphamgiohang[i].id) {
                                                       tongtienmoisp = sanphamgiohang[i].soluong * sanphamgiohang[i].gia;
                                                       break;
                                                   }
                                               }
                                               return tongtienmoisp;
                                           },
                                           confirm: function () {
                                               for(i=0;i<sanphamgiohang.length;i++)
                                               {
                                                   delete sanphamgiohang[i]['soluongcu'];
                                               }
                                               sanphamgiohang = [];
                                               tongsanpham = 0;
                                               tongtien = 0;
                                               SessionService.set("AllSPGioHang", JSON.stringify(sanphamgiohang))
                                               SessionService.set("TongSPGioHang", tongsanpham)
                                               SessionService.set("TongTienGioHang", tongtien)
                                           },
                                           AllSPGioHang: function () {
                                               // SessionService.get("AllSPGioHang")
                                               return sanphamgiohang;
                                           },
                                           TongSPGioHang: function () {
                                               return tongsanpham;
                                              // return tongsanpham;
                                           },
                                           TongTienGioHang: function () {
                                               return tongtien;
                                             //  return tongtien;
                                           }
                                       }
                                   })
                                    .factory("SawProductsService", function (SessionService) {
                                        var sanphamdaxem = [];      
                                        if (SessionService.get("SPDaXem")) {
                                            sanphamdaxem = JSON.parse(SessionService.get("SPDaXem"))
                                        }
                                        return {
                                            SanPhamDaXem: function (id, tensp, gia, hinh) {
                                                var flag = 0;
                                                if (sanphamdaxem.length <= 10) {
                                                    for (i = 0; i < sanphamdaxem.length; i++) {
                                                        if (id == sanphamdaxem[i].id) {
                                                            flag = 1;
                                                            break;
                                                        }
                                                    }

                                                    if (flag == 0) {
                                                        sanphamdaxem.push({ id: id, Tensanpham: tensp, gia: gia, HinhAnh: hinh })
                                                    }
                                                    SessionService.set("SPDaXem", JSON.stringify(sanphamdaxem))
                                                }
                                            },
                                            AllSPDaXem: function () {
                                                // SessionService.get("AllSPGioHang")
                                                return sanphamdaxem;
                                            }
                                        }
                                    })
                                    .factory("SessionService", function () {
                                        return {
                                            set: function (key, val) {
                                                return localStorage.setItem(key, val);
                                            },
                                            get: function (key) {
                                                return localStorage.getItem(key);
                                            },
                                            destroy: function (key) {
                                                return localStorage.removeItem(key);
                                            },
                                        }
                                    })
                                    .factory("CategoryService", function ($http) {
                                        return {
                                            AllCategory: function () {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/TheLoai'
                                                });
                                            },
                                            SubCategoryOfCategory: function (Id_Category) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SubTheLoai/SubCategoryByCategory/' + Id_Category
                                                })
                                            },
                                            OtherSubCategory: function () {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SubTheLoai/OtherSubCategory/'
                                                })
                                            },
                                            CategoryByProduct: function (id) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SubTheLoai/SubCatbyProduct/' + id
                                                })
                                            }
                                        }
                                    })
                                    .factory("ProductService", function ($http) {
                                        return {
                                            AllProducts: function () {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPham/GetProductsTime'
                                                })
                                            },
                                            ProductByCat: function (CatId) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPham/ProductByCatTime/' + CatId
                                                })
                                            },
                                            ProductBySubCat: function (SubCatId) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPham/ProductBySubCatTime/' + SubCatId
                                                })
                                            },
                                            OtherProduct: function () {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPham/OtherProductTime/'
                                                })
                                            },
                                            ProductById: function (id) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPham/'+id
                                                })
                                            },
                                            RelaredProducts: function (id) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPham/RelaredProductsTime/' + id
                                                })
                                            },
                                            IncreaseView: function (id) {
                                                return $http({
                                                    method: 'PUT',
                                                    url: 'http://localhost:4443/api/SanPham/IncreaseView/' + id
                                                })
                                            },
                                            ProductsRecommendation: function (id) {
                                                return $http({
                                                    method: 'GET',
                                                    url: 'http://localhost:4443/api/SanPhamDeNghi/ProductsRecommendation/' + id
                                                })
                                            }
                                        }
                                    })

                                     .factory("OrderService", function ($http) {
                                         return {
                                             Order: function (Nguoinhan, Diachi, Ngaygiao, Email, Sodienthoai, Id_KhachHang, TongTien, giohang) {
                     
                                                 return $http({
                                                     method: 'POST',
                                                     url: 'http://localhost:4443/api/DonHang',
                                                     data: { 'Nguoinhan': Nguoinhan, 'DiaChiGiao': Diachi, 'SoDienThoai': Sodienthoai, 'Email': Email, 'NgayGiao': Ngaygiao, 'Id_KhachHang': Id_KhachHang, 'TongTien': TongTien, 'giohang': giohang }
                                                 })
                                             },
                                             OrderCustomer: function (id) {
                                                 return $http({
                                                     method: 'GET',
                                                     url: 'http://localhost:4443/api/DonHang/OrderByCustomer/'+id
                                                    
                                                 })
                                             },
                                             OderDetails: function (id) {
                                                 return $http({
                                                     method: 'GET',
                                                     url: 'http://localhost:4443/api/DonHang/OrderDetails/' + id

                                                 })
                                             }
                                         }
                                     })
                                    .controller("IndexController", function ($scope, $uibModal, SessionService, LoginService) {
                                        $scope.dangnhap = function () {
                                            var $modalInstance= $uibModal.open({
                                                templateUrl: 'DangNhap.html',
                                                controller: 'LoginController'
                                            });
                                        }
                                            var username = SessionService.get('username')
                                            if (username) {
                                                $scope.nguoidung = username;
                                            }
                                            $scope.logout = function () {
                                                LoginService.Loguot();
                                            }
                                            $scope.$watch(function () {
                                                return SessionService.get('username')
                                            }, function (newval, oldval) {
                                                $scope.nguoidung = newval;
                                            })
                                            $scope.dangky = function () {
                                                var $modalInstance = $uibModal.open({
                                                    templateUrl: 'DangKy.html',
                                                    controller: 'SigninController'
                                                });
                                            }
                                    })                                   
                                    .controller("MenuController", function (CategoryService, $scope) {
                                        CategoryService.AllCategory().then(function (resp) {
                                            $scope.theloais = resp.data;
                                        }, function (resp) {
                                            console.log(resp.data)
                                        })
                                        $scope.hoverCategory = function (Id_Category) {
                                            CategoryService.SubCategoryOfCategory(Id_Category).then(function (resp) {
                                                $scope.subtheloais = resp.data;
                                            }, function (resp) {
                                                $scope.subtheloais = null;
                                            })
                                            CategoryService.OtherSubCategory().then(function (resp) {
                                                $scope.subtheloaiKhacs = resp.data;
                                            }, function () {
                                                $scope.subtheloaiKhacs = null;
                                            })
                                        }
                                    })
                                    .controller("homeController", function (ProductService, $scope, CartService, $uibModal) {
                                        $scope.Productsfilter = [];
                                        $scope.currentPage = 1;
                                        $scope.numPerPage = 12;
                                        $scope.maxSize = 4;
                                        $scope.addtoCart = function (id, tensanpham, gia, hinh) {
                                            CartService.AddtoCart(id, tensanpham, gia, hinh)
                                            var $modalInstance = $uibModal.open({
                                                templateUrl: 'SanPhamDeNghi.html',
                                                controller: 'SanPhamDeNghiController',
                                                resolve: {
                                                    IdSanPham: function () {
                                                        return id;
                                                    }
                                                }
                                            });

                                        }
                                        ProductService.AllProducts().then(function (resp) {
                                            $scope.sanphams = [];
                                            for (i = 0; i < resp.data.length; i++) {
                                                $scope.sanphams.push(resp.data[i]);
                                            }
                                            $scope.$watch('currentPage + numPerPage', function () {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                                                var end = begin + $scope.numPerPage;
                                                $scope.Productsfilter = $scope.sanphams.slice(begin, end);
                                            })
                                        }, function (error) {
                                            $scope.Productsfilter = null;
                                        })
                                    })
                                    .controller("ProductByCatController", function (ProductService, $scope, $routeParams, CartService, $uibModal) {
                                        $scope.Productsfilter = [];
                                        $scope.currentPage = 1;
                                        $scope.numPerPage = 12;
                                        $scope.maxSize = 4;
                                        $scope.addtoCart = function (id, tensanpham, gia, hinh) {
                                            CartService.AddtoCart(id, tensanpham, gia, hinh)
                                            var $modalInstance = $uibModal.open({
                                                templateUrl: 'SanPhamDeNghi.html',
                                                controller: 'SanPhamDeNghiController',
                                                resolve: {
                                                    IdSanPham: function () {
                                                        return id;
                                                    }
                                                }
                                            });
                                        }
                                        ProductService.ProductByCat($routeParams.id).then(function (resp) {
                                            $scope.sanphams = [];
                                            for (i = 0; i < resp.data.length; i++) {
                                                $scope.sanphams.push(resp.data[i]);
                                            }
                                            $scope.$watch('currentPage + numPerPage', function () {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                                                var end = begin + $scope.numPerPage;
                                                $scope.Productsfilter = $scope.sanphams.slice(begin, end);
                                            })
                                        }, function (error) {
                                            $scope.Productsfilter = null;
                                        })
                                    })
                                    .controller("ProductBySubCatController", function (ProductService, $scope, $routeParams, CartService, $uibModal) {
                                        $scope.Productsfilter = [];
                                        $scope.currentPage = 1;
                                        $scope.numPerPage = 12;
                                        $scope.maxSize = 4;
                                        $scope.addtoCart = function (id, tensanpham, gia, hinh) {
                                            CartService.AddtoCart(id, tensanpham, gia, hinh)
                                            var $modalInstance = $uibModal.open({
                                                templateUrl: 'SanPhamDeNghi.html',
                                                controller: 'SanPhamDeNghiController',
                                                resolve: {
                                                    IdSanPham: function () {
                                                        return id;
                                                    }
                                                }
                                            });
                                        }
                                        ProductService.ProductBySubCat($routeParams.id).then(function (resp) {
                                            $scope.sanphams = [];
                                            for (i = 0; i < resp.data.length; i++) {
                                                $scope.sanphams.push(resp.data[i]);
                                            }
                                            $scope.$watch('currentPage + numPerPage', function () {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                                                var end = begin + $scope.numPerPage;
                                                $scope.Productsfilter = $scope.sanphams.slice(begin, end);
                                            })
                                        }, function (error) {
                                            $scope.Productsfilter = null;
                                        })
                                    })
                                    .controller("OtherProductController", function (ProductService, $scope, CartService, $uibModal) {
                                        $scope.Productsfilter = [];
                                        $scope.currentPage = 1;
                                        $scope.numPerPage = 12;
                                        $scope.maxSize = 4;
                                        $scope.addtoCart = function (id, tensanpham, gia, hinh) {
                                            CartService.AddtoCart(id, tensanpham, gia, hinh)
                                            var $modalInstance = $uibModal.open({
                                                templateUrl: 'SanPhamDeNghi.html',
                                                controller: 'SanPhamDeNghiController',
                                                resolve: {
                                                    IdSanPham: function () {
                                                        return id;
                                                    }
                                                }
                                            });
                                        }
                                        ProductService.OtherProduct().then(function (resp) {
                                            $scope.sanphams = [];
                                            for (i = 0; i < resp.data.length; i++) {
                                                $scope.sanphams.push(resp.data[i]);
                                            }
                                            $scope.$watch('currentPage + numPerPage', function () {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                                                var end = begin + $scope.numPerPage;
                                                $scope.Productsfilter = $scope.sanphams.slice(begin, end);
                                            })
                                        }, function (error) {
                                            $scope.Productsfilter = null;
                                        })
                                    })
                                    .controller("ProductDetailController", function (ProductService, $scope, $routeParams, CategoryService, CartService, SawProductsService, $uibModal) {
                                        $scope.addtoCart = function (id, tensanpham, gia, hinh) {
                                            CartService.AddtoCart(id, tensanpham, gia, hinh)
                                            var $modalInstance = $uibModal.open({
                                                templateUrl: 'SanPhamDeNghi.html',
                                                controller: 'SanPhamDeNghiController',
                                                resolve: {
                                                    IdSanPham: function () {
                                                        return id;
                                                    }
                                                }
                                            });
                                        }
                                        ProductService.IncreaseView($routeParams.id).then(function (resp) {

                                        }, function (error) {
                                            console.log(error.data)
                                        })
                                        ProductService.ProductById($routeParams.id).then(function (resp) {
                                            $scope.sanpham = resp.data;
                                            SawProductsService.SanPhamDaXem($routeParams.id, resp.data.TenSanPham, resp.data.Gia, resp.data.HinhAnh)
                                        }, function (error) {
                                            $scope.sanpham = null;
                                        })
                                        CategoryService.CategoryByProduct($routeParams.id).then(function (resp) {
                                            ProductService.RelaredProducts(resp.data).then(function (resp) {
                                                $scope.sanphamlienquans = resp.data;
                                            }, function (error) {
                                                console.log(error.data);
                                            })
                                        }, function (error) {
                                            console.log(error.data);
                                        })
                                        
                                    })
                                     .controller("cartController", function ($scope, CartService, SawProductsService) {
                                         $scope.sanphamdaxems = SawProductsService.AllSPDaXem();
                                         $scope.tongsanpham = CartService.TongSPGioHang();
                                         $scope.tongtien = CartService.TongTienGioHang();
                                         $scope.sanphamgiohangs = CartService.AllSPGioHang();
  

                                         $scope.edit = function (id) { CartService.edit(id); }
                                         $scope.delete = function (id) { CartService.deletecart(id); }
                                         $scope.confirm = function () { CartService.confirm(); }
                                         $scope.tienMoiSP = function (id) {
                                             return CartService.tienMoiSP(id)
                                         }
                                         $scope.$watch(function () {
                                             return CartService.TongSPGioHang();
                                         }, function (newval, oldval) {
                                             $scope.tongsanpham = newval;
                                         })
                                         $scope.$watch(function () {
                                             return CartService.TongTienGioHang();
                                         }, function (newval, oldval) {
                                             $scope.tongtien = newval;
                                         })
                                         $scope.$watch(function () {
                                             return CartService.AllSPGioHang();
                                         }, function (newval, oldval) {
                                             $scope.sanphamgiohangs = newval;
                                         })
                                         $scope.$watch(function () {
                                             return SawProductsService.AllSPDaXem();
                                         }, function (newval, oldval) {
                                             $scope.sanphamdaxems = newval;
                                         })
                                     })
                                     .controller("ThanhtoanController", function ($scope, CartService, LoginService, SessionService, $window, $uibModal, OrderService, SawProductsService, $filter) {

                                         var dathang;
                                         $scope.sanphamdaxems = SawProductsService.AllSPDaXem();
                                         $scope.sanphamgiohangs = CartService.AllSPGioHang();
                                         $scope.tongtien = CartService.TongTienGioHang();
                                         $scope.tienMoiSP = function (id) {
                                             return CartService.tienMoiSP(id)
                                         }
                                         $scope.dathang = function () {
       
                                             if (!$scope.sanphamgiohangs || $scope.sanphamgiohangs.length==0) {
                                                 $window.alert("Bạn không có sản phẩm trong giỏ hàng")
                                             }
                                             else {
                                                 giohangclient=[];
                                                 for(i=0;i<$scope.sanphamgiohangs.length;i++)
                                                 {
                                                     giohangclient.push({ Id_SanPham: $scope.sanphamgiohangs[i].id,SoLuong:$scope.sanphamgiohangs[i].soluong});
                                                 }
                                                 
                                                 OrderService.Order($scope.nguoinhan, $scope.diachi, $scope.ngaygiao, $scope.email, $scope.sodienthoai, SessionService.get('id'), $scope.tongtien, giohangclient).then(function (resp) {
                                                     
                                                     $window.alert(resp.data);
                                                     CartService.confirm();
                                                 }, function (error) {
                                                     $window.alert(error.data);
                                                 })
                                               /*  dathang = {
                                                     Nguoinhan: $scope.nguoinhan,
                                                     Diachi: $scope.diachi,
                                                     Ngaygiao: $scope.ngaygiao,
                                                     Email: $scope.email,
                                                     Sodienthoai: $scope.sodienthoai,
                                                     Id_KhachHang: SessionService.get('id'),
                                                     TongTien: $scope.tongtien,
                                                     giohang: giohangclient
                                                 }*/                                                 
                                             }
                                         }
                                         var username = SessionService.get('username')
                                         if (username) {
                                             $scope.nguoidung = username;
                                         }
                                         $scope.$watch(function () {
                                             return SessionService.get('username')
                                         }, function (newval, oldval) {
                                             $scope.nguoidung = newval;
                                         })
                                         $scope.dangnhap = function () {
                                             LoginService.Login($scope.username, $scope.password).then(function (resp) {
                                                 SessionService.set("username", resp.data.UserName)
                                                 SessionService.set("id", resp.data.Id)
                                                 $scope.username = ""
                                                 $scope.password=""
                                             }, function (resp) {
                                                 $window.alert(resp.data)
                                             })
                                         }
                                         $scope.dangky = function () {
    
                                                 var $modalInstance = $uibModal.open({
                                                     templateUrl: 'DangKy.html',
                                                     controller: 'SigninController'
                                                 });
                                         }
                                         $scope.$watch(function () {
                                             return CartService.TongSPGioHang();
                                         }, function (newval, oldval) {
                                             $scope.tongsanpham = newval;
                                         })
                                         $scope.$watch(function () {
                                             return CartService.TongTienGioHang();
                                         }, function (newval, oldval) {
                                             $scope.tongtien = newval;
                                         })
                                         $scope.$watch(function () {
                                             return CartService.AllSPGioHang();
                                         }, function (newval, oldval) {
                                             $scope.sanphamgiohangs = newval;
                                         })
                                         $scope.$watch(function () {
                                             return SawProductsService.AllSPDaXem();
                                         }, function (newval, oldval) {
                                             $scope.sanphamdaxems = newval;
                                         })
                                     })
                                        .controller("LoginController", function (LoginService, $scope, $window, SessionService, $uibModalInstance, $uibModal) {
                                            $scope.login = function () {
                                                LoginService.Login($scope.username, $scope.password).then(function (resp) {
                                                    SessionService.set("username", resp.data.UserName)
                                                    SessionService.set("id", resp.data.Id)
                                                    $uibModalInstance.dismiss('cancel');
                                                }, function (resp) {
                                                    $window.alert(resp.data)
                                                })
                                            }
                                            $scope.quit = function () {
                                                $uibModalInstance.dismiss('cancel');
                                            }
                                            $scope.dangky = function () {
                                                $uibModalInstance.dismiss('cancel');
                                                var $modalInstance = $uibModal.open({
                                                    templateUrl: 'DangKy.html',
                                                    controller: 'SigninController'
                                                });
                                            }
                                        })
                                        .controller("SigninController", function (LoginService, $scope, $window, $uibModalInstance) {
 
                                            $scope.register = function () {
                                                console.log($scope.username+$scope.password)
                                                LoginService.Register($scope.username, $scope.password).then(function (resp) {
                                                    $window.alert(resp.data)
                                                    $uibModalInstance.dismiss('cancel');
                                                }, function (resp) {
                                                    $window.alert(resp.data)
                                                })
                                            }
                                            $scope.quit = function () {
                                                $uibModalInstance.dismiss('cancel');
                                            }
                                        })
                                        .controller("KhachHangController", function ($scope, OrderService, SessionService, $window, $uibModal) {                                           
                                            $scope.donhangs = null;
                                            var id=SessionService.get('id')
                                            if (!id || !$scope.message1) {
                                                $scope.message = "Bạn chưa đăng nhập";                                         
                                            }
                                            $scope.chitietdonhang = function (id) {
                                                var $modalInstance = $uibModal.open({
                                                    templateUrl: 'CTDonHang.html',
                                                    controller: 'CTDonHangController',
                                                    windowClass: 'large-Modal',
                                                    resolve: {
                                                        IdDonhang: function () {
                                                            return id;
                                                        }
                                                    }
                                                })                                                                                                  
                                            }
                                          $scope.$watch(function () {
                                                return SessionService.get('id');
                                          }, function (newval, oldval) {
                                              $scope.message1 = newval;
                                             
                                              OrderService.OrderCustomer(newval).then(function (resp) {
                                                    $scope.donhangs = resp.data;
                                                }, function (error) {
                                                    $scope.donhangs = null;
                                                })
                                            })
                                          

                                        })
                                        .controller("CTDonHangController", function ($scope, OrderService, $uibModalInstance, $window, IdDonhang) {
                                            
                                            OrderService.OderDetails(IdDonhang).then(function (resp) {
                                                $scope.ctdonhangs = resp.data
                                            }, function (error) {
                                                $scope.ctdonhangs = null;
                                                console.log(error.data)
                                            })
                                            $scope.quit = function () {
                                                $uibModalInstance.dismiss('cancel');
                                            }
                                        })
                                        .controller("SanPhamDeNghiController", function ($scope, ProductService, $uibModalInstance, CartService, IdSanPham) {
                                            $scope.Productsfilter = [];
                                            $scope.currentPage = 1;
                                            $scope.numPerPage = 2;
                                            $scope.maxSize = 4;
                                            ProductService.ProductsRecommendation(IdSanPham).then(function (resp) {
                                                $scope.sanphams = [];
                                                for (i = 0; i < resp.data.length; i++) {
                                                    $scope.sanphams.push(resp.data[i]);
                                                }
                                                $scope.$watch('currentPage + numPerPage', function () {
                                                    var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                                                    var end = begin + $scope.numPerPage;
                                                    $scope.Productsfilter = $scope.sanphams.slice(begin, end);
                                                })
                                            }, function (error) {
                                                $scope.message = "Không có sản phẩm đề nghị cho sản phẩm này"
                                            })
                                            $scope.quit = function () {
                                                $uibModalInstance.dismiss('cancel');
                                            }
                                            $scope.addtoCart = function (id, tensanpham, gia, hinh) {
                                                CartService.AddtoCart(id, tensanpham, gia, hinh)
                                            }
                                        })

