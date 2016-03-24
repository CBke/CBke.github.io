
function add(a, b) {
    return a + b;
}

function BoardItem(dimention) {
    var Values = [];
    var Checked = false;

    for (var i = 1; i <= dimention; i++)
        Values.push(i);

    this.RemoveValue = function (value) {
        var index = Values.indexOf(value);
        if (index > -1)
            Values.splice(index, 1);
    };
    this.SetValue = function (value) {
        Values = [value];
        Checked = true;
    };
    this.isChecked = function () {
        return Checked;
    };
    this.PossibleValues = function () {
        return Values;
    };
}

function Board(dimention) {
    var Dimetion = dimention;
    var Items = [];
    var total = dimention * dimention;
    var Unresolvable = "Unresolvable!"

    for (var i = 0; i < total; i++)
        Items.push(new BoardItem(dimention));

    this.BoardDimetion = function () {
        return Dimetion;
    };

    this.Item = function (x, y) {
        return Items[y * this.BoardDimetion() + x];
    };

    this.setItem = function (x, y, value) {
        this.Item(x, y).SetValue(value);

        for (var rx = 0; rx < this.BoardDimetion() ; rx++)
            if (x != rx)
                this.Item(rx, y).RemoveValue(value);

        for (var ry = 0; ry < this.BoardDimetion() ; ry++)
            if (y != ry)
                this.Item(x, ry).RemoveValue(value);

        var sx = parseInt(x / 3) * 3;
        var sy = parseInt(y / 3) * 3;
        for (rx = 0; rx < 3; rx++)
            for (ry = 0; ry < 3; ry++)
                if (x != rx + sx && y != ry + sy)
                    this.Item(rx + sx, ry + sy).RemoveValue(value);
    };


    this.UnResolvable = function () {
        return Items.filter(function (item) {
            return item.PossibleValues().length < 1;
        }).length > 0;
    };

    var Iterations = 0;

    this.Resolve = function () {
        while (Items.filter(function (item) { return !item.isChecked(); }).length > 0) {

            if (this.UnResolvable())
                throw new Error(Unresolvable);

            Iterations++;

            if (Iterations > 1) {
                for (var crx = 0; crx < 3; crx++)
                    for (var cry = 0; cry < 3; cry++) {
                        for (var value = 1 ; value <= this.BoardDimetion() ; value++) {

                            var found = [0, 0, 0];

                            for (var x = 0; x < 3; x++)
                                for (var y = 0; y < 3; y++)
                                    if (this.Item(crx * 3 + x, cry * 3 + y).PossibleValues().indexOf(value) > -1)
                                        found[x] = 1;

                            if (found.reduce(add, 0) == 1) {
                                Iterations = 0;
                                for (var y = 0; y < this.BoardDimetion() ; y++)
                                    if (y < cry * 3 || y > cry * 3 + 2)
                                        this.Item(crx * 3 + found.indexOf(1), y).RemoveValue(value);
                            }

                            found = [0, 0, 0];

                            for (var y = 0; y < 3; y++)
                                for (var x = 0; x < 3; x++)
                                    if (this.Item(crx * 3 + x, cry * 3 + y).PossibleValues().indexOf(value) > -1)
                                        found[y] = 1;

                            if (found.reduce(add, 0) == 1) {
                                Iterations = 0;
                                for (var x = 0; x < this.BoardDimetion() ; x++)
                                    if (x < crx * 3 || x > crx * 3 + 2)
                                        this.Item(x, cry * 3 + found.indexOf(1)).RemoveValue(value);
                            }
                        }
                    }
                if (Iterations > 1)
                    throw new Error(Unresolvable);
            }
            for (var x = 0 ; x < this.BoardDimetion() ; x++)
                for (var y = 0 ; y < this.BoardDimetion() ; y++) {

                    var found = 0;
                    var value = -1;

                    if (!this.Item(x, y).isChecked() && this.Item(x, y).PossibleValues().length == 1) {
                        value = this.Item(x, y).PossibleValues()[0];
                        found = 1;
                    }
                    else if (!this.Item(x, y).isChecked()) {
                        var arrayLength = this.Item(x, y).PossibleValues().length;
                        for (var i = 0; i < arrayLength && found != 1; i++) {

                            value = this.Item(x, y).PossibleValues()[i];

                            found = 0;
                            for (var rx = 0 ; rx < this.BoardDimetion() ; rx++)
                                if (this.Item(rx, y).PossibleValues().indexOf(value) > -1)
                                    found++;

                            if (found != 1) {
                                found = 0;
                                for (var ry = 0; ry < this.BoardDimetion() ; ry++)
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