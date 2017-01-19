/**
 * Created by gxu on 10/5/16.
 */
'use strict';


function mockProfile() {
    var self = this;
    self.profile = {
        name: 'test_name',
        country: 'test_country',
        city: 'test_city',
        gender: 'male',
        email: 'test@test.com',
        phone_number: '000-000-000',
        birthday: '1970-01-01',
        photo_url: 'http://scontent.xx.fbcdn.net' +
        '/v/t1.0-1/c77.38.475.475/s50x50/' +
        '76120_1614436037423_3940879_n.jpg?' +
        'oh=c2c8e725b55309452cae3fd205e224ad&oe=5813588A',
        bio: 'test_bio'
    };

}

module.exports = mockProfile;