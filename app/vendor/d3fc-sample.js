(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('./d3fc-rebind')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-array', './d3fc-rebind'], factory) :
    (factory((global.fc = global.fc || {}),global.d3,global.fc));
}(this, (function (exports,d3Array,d3fcRebind) { 'use strict';

var bucket = function () {

    var bucketSize = 10;

    var bucket = function bucket(data) {
        return bucketSize <= 1 ? data.map(function (d) {
            return [d];
        }) : d3Array.range(0, Math.ceil(data.length / bucketSize)).map(function (i) {
            return data.slice(i * bucketSize, (i + 1) * bucketSize);
        });
    };

    bucket.bucketSize = function (x) {
        if (!arguments.length) {
            return bucketSize;
        }

        bucketSize = x;
        return bucket;
    };

    return bucket;
};

var largestTriangleOneBucket = function () {

    var dataBucketer = bucket();
    var x = function x(d) {
        return d;
    };
    var y = function y(d) {
        return d;
    };

    var largestTriangleOneBucket = function largestTriangleOneBucket(data) {

        if (dataBucketer.bucketSize() >= data.length) {
            return data;
        }

        var pointAreas = calculateAreaOfPoints(data);
        var pointAreaBuckets = dataBucketer(pointAreas);

        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map(function (thisBucket, i) {

            var pointAreaBucket = pointAreaBuckets[i];
            var maxArea = d3Array.max(pointAreaBucket);
            var currentMaxIndex = pointAreaBucket.indexOf(maxArea);

            return thisBucket[currentMaxIndex];
        });

        // First and last data points are their own buckets.
        return [].concat([data[0]], subsampledData, [data[data.length - 1]]);
    };

    function calculateAreaOfPoints(data) {

        var xyData = data.map(function (point) {
            return [x(point), y(point)];
        });

        var pointAreas = d3Array.range(1, xyData.length - 1).map(function (i) {
            var lastPoint = xyData[i - 1];
            var thisPoint = xyData[i];
            var nextPoint = xyData[i + 1];

            var base = (lastPoint[0] - nextPoint[0]) * (thisPoint[1] - lastPoint[1]);
            var height = (lastPoint[0] - thisPoint[0]) * (nextPoint[1] - lastPoint[1]);

            return Math.abs(0.5 * base * height);
        });

        return pointAreas;
    }

    d3fcRebind.rebind(largestTriangleOneBucket, dataBucketer, 'bucketSize');

    largestTriangleOneBucket.x = function (d) {
        if (!arguments.length) {
            return x;
        }

        x = d;

        return largestTriangleOneBucket;
    };

    largestTriangleOneBucket.y = function (d) {
        if (!arguments.length) {
            return y;
        }

        y = d;

        return largestTriangleOneBucket;
    };

    return largestTriangleOneBucket;
};

var largestTriangleThreeBucket = function () {

    var x = function x(d) {
        return d;
    };
    var y = function y(d) {
        return d;
    };
    var dataBucketer = bucket();

    var largestTriangleThreeBucket = function largestTriangleThreeBucket(data) {

        if (dataBucketer.bucketSize() >= data.length) {
            return data;
        }

        var buckets = dataBucketer(data.slice(1, data.length - 1));
        var firstBucket = data[0];
        var lastBucket = data[data.length - 1];

        // Keep track of the last selected bucket info and all buckets
        // (for the next bucket average)
        var allBuckets = [].concat([firstBucket], buckets, [lastBucket]);

        var lastSelectedX = x(firstBucket);
        var lastSelectedY = y(firstBucket);

        var subsampledData = buckets.map(function (thisBucket, i) {

            var nextAvgX = d3Array.mean(allBuckets[i + 1], x);
            var nextAvgY = d3Array.mean(allBuckets[i + 1], y);

            var xyData = thisBucket.map(function (item) {
                return [x(item), y(item)];
            });

            var areas = xyData.map(function (item) {
                var base = (lastSelectedX - nextAvgX) * (item[1] - lastSelectedY);
                var height = (lastSelectedX - item[0]) * (nextAvgY - lastSelectedY);

                return Math.abs(0.5 * base * height);
            });

            var highestIndex = areas.indexOf(d3Array.max(areas));
            var highestXY = xyData[highestIndex];

            lastSelectedX = highestXY[0];
            lastSelectedY = highestXY[1];

            return thisBucket[highestIndex];
        });

        // First and last data points are their own buckets.
        return [].concat([data[0]], subsampledData, [data[data.length - 1]]);
    };

    d3fcRebind.rebind(largestTriangleThreeBucket, dataBucketer, 'bucketSize');

    largestTriangleThreeBucket.x = function (d) {
        if (!arguments.length) {
            return x;
        }

        x = d;

        return largestTriangleThreeBucket;
    };

    largestTriangleThreeBucket.y = function (d) {
        if (!arguments.length) {
            return y;
        }

        y = d;

        return largestTriangleThreeBucket;
    };

    return largestTriangleThreeBucket;
};

var modeMedian = function () {

    var dataBucketer = bucket();
    var value = function value(d) {
        return d;
    };

    var modeMedianSampler = function(data) {

        if (dataBucketer.bucketSize() > data.length) {
            return data;
        }

        var minMax = d3Array.extent(data, value);
        var buckets = dataBucketer(data.slice(1, data.length - 1));

        var subsampledData = buckets.map(function (thisBucket, i) {

            var frequencies = {};
            var mostFrequent;
            var mostFrequentIndex;
            var singleMostFrequent = true;

            var values = thisBucket.map(value);

            var globalMinMax = values.filter(function (value) {
                return value === minMax[0] || value === minMax[1];
            }).map(function (value) {
                return values.indexOf(value);
            })[0];

            if (globalMinMax !== undefined) {
                return thisBucket[globalMinMax];
            }

            values.forEach(function (item, i) {
                if (frequencies[item] === undefined) {
                    frequencies[item] = 0;
                }
                frequencies[item]++;

                if (frequencies[item] > frequencies[mostFrequent] || mostFrequent === undefined) {
                    mostFrequent = item;
                    mostFrequentIndex = i;
                    singleMostFrequent = true;
                } else if (frequencies[item] === frequencies[mostFrequent]) {
                    singleMostFrequent = false;
                }
            });

            if (singleMostFrequent) {
                return thisBucket[mostFrequentIndex];
            } else {
                return thisBucket[Math.floor(thisBucket.length / 2)];
            }
        });

        // First and last data points are their own buckets.
        return [].concat([data[0]], subsampledData, [data[data.length - 1]]);
    };

    d3fcRebind.rebind(modeMedianSampler, dataBucketer, 'bucketSize');

    modeMedianSampler.value = function (x) {
        if (!arguments.length) {
            return value;
        }

        value = x;

        return modeMedianSampler;
    };

    return modeMedianSampler;
};

exports.bucket = bucket;
exports.largestTriangleOneBucket = largestTriangleOneBucket;
exports.largestTriangleThreeBucket = largestTriangleThreeBucket;
exports.modeMedian = modeMedian;

Object.defineProperty(exports, '__esModule', { value: true });

})));
