/// <reference path="_all.ts" />

module lova {
    'use strict';

    export class ServantService {
        private url: string = './assets/data/servant.json';
        private servants: any[] = [];

        public static $inject = [
            '$http',
            '$q'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService
        ) {
        }

        public load(): ng.IPromise<any> {
            var deferrd = this.$q.defer();
            var me = this;
            this.$http.get(this.url, {cache: true})
                .then(function(res: any) {
                    me.servants = res.data;
                    deferrd.resolve();
                }, function() {
                    deferrd.reject();
                });
            return deferrd.promise;
        }

        public loadServants(): ng.IPromise<any> {
            var deferrd = this.$q.defer();
            var me = this;
            this.load()
                .then(function() {
                    deferrd.resolve({servants: me.servants});
                });
            return deferrd.promise;
        }

        public loadServant(id): ng.IPromise<any> {
            var deferrd = this.$q.defer();
            var me = this;
            this.load()
                .then(function() {
                    me.servants.forEach(function(servant) {
                        if (servant.id == id) {
                            deferrd.resolve({servant: servant});
                        }
                    });
                });
            return deferrd.promise;
        }
    }

    export class ScrollService {
        private positions: any = {};

        public static $inject = [
            '$location'
        ];

        constructor(
            private $location: ng.ILocationService
        ) {
            $(window).on('scroll', () => {
                this.positions[this.$location.path()] = $(window).scrollTop();
            });
        }

        public restore(): void {
            $(window).scrollTop(this.positions[this.$location.path()] || 0);
        }
    }
}