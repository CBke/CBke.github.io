function add(a, b) {
    return a + b;
}

function getAllIndexes(arr, val) {
    var indexes = [],
        i;
    for (i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function Equal(a, b) {
    return a.length == b.length && a.every(function(v, i) {
        return v === b[i];
    });
}

function BoardItem(dimention) {
    var Values = [];
    var Checked = false;

    for (var i = 1; i <= dimention; i++)
        Values.push(i);

    this.RemoveValue = function(value) {
        var index = Values.indexOf(value);
        if (index > -1) {
            Values.splice(index, 1);
            return true;
        }
        return false;
    };
    this.RemoveValues = function(values) {
        var removed = false;
        for (i = 0; i < values.length; i++) {
            if (this.RemoveValue(values[i]))
                removed = true;
        }
        return removed;
    };
    this.SetValue = function(value) {
        Values = [value];
        Checked = true;
    };
    this.isChecked = function() {
        return Checked;
    };
    this.PossibleValues = function() {
        return Values;
    };
}

function Board(dimention) {
    var Dimetion = dimention;
    var Items = [];
    var total = dimention * dimention;
    var Unresolvable = "Unresolvable!";

    for (var i = 0; i < total; i++)
        Items.push(new BoardItem(dimention));

    this.BoardDimetion = function() {
        return Dimetion;
    };

    this.Item = function(x, y) {
        return Items[y * this.BoardDimetion() + x];
    };

    this.setItem = function(x, y, value) {
        this.Item(x, y).SetValue(value);

        for (var rx = 0; rx < this.BoardDimetion(); rx++)
            if (x != rx)
                this.Item(rx, y).RemoveValue(value);

        for (var ry = 0; ry < this.BoardDimetion(); ry++)
            if (y != ry)
                this.Item(x, ry).RemoveValue(value);

        var sx = parseInt(x / 3) * 3;
        var sy = parseInt(y / 3) * 3;
        for (rx = 0; rx < 3; rx++)
            for (ry = 0; ry < 3; ry++)
                if (x != rx + sx && y != ry + sy)
                    this.Item(rx + sx, ry + sy).RemoveValue(value);
    };


    this.UnResolvable = function() {
        return Items.filter(function(item) {
            return item.PossibleValues().length < 1;
        }).length > 0;
    };

    var Iterations = 0;

    this.Resolve = function() {
        while (Items.filter(function(item) {
                    return !item.isChecked();
                }).length > 0) {

            if (this.UnResolvable())
                throw new Error(Unresolvable);

            Iterations++;

            if (Iterations > 1) {
                for (var crx = 0; crx < 3; crx++)
                    for (var cry = 0; cry < 3; cry++) {
                        for (var value = 1; value <= this.BoardDimetion(); value++) {

                            var found = [0, 0, 0];

                            for (var x = 0; x < 3; x++)
                                for (var y = 0; y < 3; y++)
                                    if (this.Item(crx * 3 + x, cry * 3 + y).PossibleValues().indexOf(value) > -1)
                                        found[x] = 1;

                            if (found.reduce(add, 0) == 1)
                                for (var y = 0; y < this.BoardDimetion(); y++)
                                    if (y < cry * 3 || y > cry * 3 + 2)
                                        if (this.Item(crx * 3 + found.indexOf(1), y).RemoveValue(value))
                                            Iterations = 0;


                            found = [0, 0, 0];

                            for (var y = 0; y < 3; y++)
                                for (var x = 0; x < 3; x++)
                                    if (this.Item(crx * 3 + x, cry * 3 + y).PossibleValues().indexOf(value) > -1)
                                        found[y] = 1;

                            if (found.reduce(add, 0) == 1)
                                for (var x = 0; x < this.BoardDimetion(); x++)
                                    if (x < crx * 3 || x > crx * 3 + 2)
                                        if (this.Item(x, cry * 3 + found.indexOf(1)).RemoveValue(value))
                                            Iterations = 0;

                        }
                }
                if (Iterations > 1) {
                    for (var value = 1; value <= this.BoardDimetion(); value++) {
                        for (var skipY = 0; skipY < 3; skipY++)
                            for (var skipX = 0; skipX < 3; skipX++) {
                                var found = [
                                    [0, 0, 0],
                                    [0, 0, 0],
                                    [0, 0, 0]
                                ];
                                for (var x = 0; x < this.BoardDimetion(); x++)
                                    if (x < skipX * 3 || x > skipX * 3 + 2)
                                        for (var y = 0; y < 3; y++)
                                            if (this.Item(x, skipY * 3 + y).PossibleValues().indexOf(value) > -1)
                                                found[y][parseInt(x / 3)] = 1;


                                var found = found.map(function(row) {
                                    return row.reduce(function(a, b) {
                                        return a + b;
                                    }, 0);
                                });
                                var idx = getAllIndexes(found, 2);
                                if (found.reduce(add, 0) == 4 && idx.length == 2)
                                    for (var y = 0; y < 3; y++)
                                        if (found[y] == 2)
                                            for (var x = 0; x < 3; x++)
                                                if (this.Item(skipX * 3 + x, skipY * 3 + y).PossibleValues().length > 1 && this.Item(skipX * 3 + x, skipY * 3 + y).RemoveValue(value))
                                                    Iterations = 0;

                        }
                        for (var skipY = 0; skipY < 3; skipY++)
                            for (var skipX = 0; skipX < 3; skipX++) {
                                var found = [
                                    [0, 0, 0],
                                    [0, 0, 0],
                                    [0, 0, 0]
                                ];
                                for (var y = 0; y < this.BoardDimetion(); y++)
                                    if (y < skipY * 3 || y > skipY * 3 + 2)
                                        for (var x = 0; x < 3; x++)
                                            if (this.Item(skipX * 3 + x, y).PossibleValues().indexOf(value) > -1)
                                                found[x][parseInt(y / 3)] = 1;


                                var found = found.map(function(row) {
                                    return row.reduce(function(a, b) {
                                        return a + b;
                                    }, 0);
                                });
                                var idy = getAllIndexes(found, 2);
                                if (found.reduce(add, 0) == 4 && idy.length == 2)
                                    for (var x = 0; x < 3; x++)
                                        if (found[x] == 2)
                                            for (var y = 0; y < 3; y++)
                                                if (this.Item(skipX * 3 + x, skipY * 3 + y).PossibleValues().length > 1 && this.Item(skipX * 3 + x, skipY * 3 + y).RemoveValue(value))
                                                    Iterations = 0;
                        }
                    }
                }
                if (Iterations > 1) {
                    for (var y = 0; y < this.BoardDimetion(); y++)
                        for (var x1 = 0; x1 < this.BoardDimetion(); x1++) {
                            found = [x1];
                            for (var x2 = x1 + 1; x2 < this.BoardDimetion(); x2++) {
                                if (Equal(this.Item(x1, y).PossibleValues(), this.Item(x2, y).PossibleValues()))
                                    found.push(x2);
                                if (found.length == this.Item(x1, y).PossibleValues().length)
                                    for (var x = 0; x < this.BoardDimetion(); x++)
                                        if (found.indexOf(x) == -1)
                                            if (this.Item(x, y).RemoveValues(this.Item(x1, y).PossibleValues()))
                                                Iterations = 0;
                            }
                    }

                    for (var x = 0; x < this.BoardDimetion(); x++)
                        for (var y1 = 0; y1 < this.BoardDimetion(); y1++) {
                            found = [y1];
                            for (var y2 = y1 + 1; y2 < this.BoardDimetion(); y2++) {
                                if (Equal(this.Item(x, y1).PossibleValues(), this.Item(x, y2).PossibleValues()))
                                    found.push(y2);
                                if (found.length == this.Item(x, y1).PossibleValues().length)
                                    for (var y = 0; y < this.BoardDimetion(); y++)
                                        if (found.indexOf(y) == -1)
                                            if (this.Item(x, y).RemoveValues(this.Item(x, y1).PossibleValues()))
                                                Iterations = 0;
                            }
                    }

                }
                if (Iterations > 1)
                    throw new Error(Unresolvable);
            }
            for (var x = 0; x < this.BoardDimetion(); x++)
                for (var y = 0; y < this.BoardDimetion(); y++) {

                    var found = 0;
                    var value = -1;

                    if (!this.Item(x, y).isChecked() && this.Item(x, y).PossibleValues().length == 1) {
                        value = this.Item(x, y).PossibleValues()[0];
                        found = 1;
                    } else if (!this.Item(x, y).isChecked()) {
                        var arrayLength = this.Item(x, y).PossibleValues().length;
                        for (var i = 0; i < arrayLength && found != 1; i++) {

                            value = this.Item(x, y).PossibleValues()[i];

                            found = 0;
                            for (var rx = 0; rx < this.BoardDimetion(); rx++)
                                if (this.Item(rx, y).PossibleValues().indexOf(value) > -1)
                                    found++;

                            if (found != 1) {
                                found = 0;
                                for (var ry = 0; ry < this.BoardDimetion(); ry++)
                                    if (this.Item(x, ry).PossibleValues().indexOf(value) > -1)
                                        found++;
                            }
                            if (found != 1) {
                                found = 0;
                                var sx = parseInt(x / 3) * 3;
                                var sy = parseInt(y / 3) * 3;
                                for (var crx = 0; crx < 3; crx++)
                                    for (var cry = 0; cry < 3; cry++)
                                        if (this.Item(crx + sx, cry + sy).PossibleValues().indexOf(value) > -1)
                                            found++;
                            }
                        }
                    }

                    if (found == 1) {
                        this.setItem(x, y, value);
                        Iterations = 0;
                    }
            }
        }
    };
}