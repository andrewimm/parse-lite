'use strict';

import {expect} from 'chai';
import {encode} from '../src/WireFormat';

suite('encode', () => {
  test('primitives', () => {
    expect(encode(null)).to.equal(null);
    expect(encode(12)).to.equal(12);
    expect(encode('foo')).to.equal('foo');
    expect(encode(false)).to.equal(false);
  });

  test('dates', () => {
    let date = encode(new Date(Date.UTC(2015, 1, 1)));
    expect(date.__type).to.equal('Date');
    expect(date.iso).to.equal('2015-02-01T00:00:00.000Z');
  });

  test('geopoint', () => {
    let geo = encode({latitude: 20, longitude: 40});
    expect(geo.latitude).to.equal(20);
    expect(geo.longitude).to.equal(40);
    expect(geo.__type).to.equal('GeoPoint');
  });
});
