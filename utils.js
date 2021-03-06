// divide window in separate containers
const product_nodes = {
    "left": document.querySelectorAll('.quantityUnit_left'),
    "middle": document.querySelectorAll('.quantityUnit_middle'),
    "right": document.querySelectorAll('.quantityUnit_right'),
}

// init all possible euro payment sizes
const euro_units = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];

function calc_product_on_keyup(event) {
    let target_id = event.target.id;

    // get wrapper container of target formed as
    // "container_<left|middle|right>_<quantityUnit>"
    let target_id_splitted = target_id.split('_').reverse();
    let quantityUnit = target_id_splitted[0];
    let columnSide = target_id_splitted[1];
    let container_id = ["container", columnSide, quantityUnit].join("_");

    // get children of wrapper container
    let children = document.querySelector('#' + container_id).children;
    let left_target = children[0];
    let middle_traget = children[1];
    let right_target = children[2];

    // parse currencyUnit content as float
    let currencyUnit = left_target.innerHTML.split('€')[0]
    currencyUnit = parseFloat(currencyUnit.replace(",", "."));
    let quantity = parseFloat(middle_traget.value);

    // get product by multiplying currencyUnit with quantity
    right_target.innerHTML = Number.parseFloat(currencyUnit * quantity).toFixed(2);

    // get column container of form 'box_<left|middle|right>' in order
    // to find all child nodes of class 'product_<left|middle|right>
    let column_container = event.path[2];
    let product_nodes = column_container.querySelectorAll(
        '.product_left, .product_middle, .product_right'
    );

    let sum = 0;
    for (let i = 0; i < 15; i++) {
        sum += parseFloat(product_nodes[i].innerHTML);
        // +(..) casts string to number
        sum = +(Number.parseFloat(sum).toFixed(2));
    };

    // write product result to bottom complete_sum div
    let complete_sum_container = column_container.querySelectorAll(
        '#complete_sum_left, #complete_sum_middle, #complete_sum_right'
    );
    complete_sum_container[0].innerHTML = sum;

    // calculate difference from right and left complete_sum and write it to
    // middle complete_sum
    let complete_sum_left = document.getElementById("complete_sum_left");
    let complete_sum_right = document.getElementById("complete_sum_right");
    let complete_sum_middle = document.getElementById("complete_sum_middle");

    complete_sum_middle.innerHTML = parseFloat(complete_sum_left.innerHTML)
        - parseFloat(complete_sum_right.innerHTML);
}

// add eventListener to all left column input nodes
for (let x of product_nodes["left"]) {
    x.addEventListener("keyup", function (event) { calc_product_on_keyup(event) });
};

// add eventListener to all right column input nodes
for (let x of product_nodes["right"]) {
    x.addEventListener("keyup", function (event) { calc_product_on_keyup(event) });
};



/**
Return a subarray elements smaller than a given pivot element.
@param {array}  euro_units_array    Array containing floats in an decreasing order.
@param {float}  sum_value           Pivot value to compare against each array element.
@return {array}                     Subarray from euro_units_array
**/
function get_working_array(euro_units_array, sum_value) {
    // init lowest index for euro_units array
    let idx = 0;

    // find smalles element in array which is greater than the sum_value
    while (sum_value < euro_units_array[idx]) {
        idx++;
    }

    // create working_array which lists all elements smaller than
    // (including) the found one
    working_array = euro_units_array.slice(idx);

    return working_array;
}


function randomized_summands(event) {

    //TODO: assert that sum at left hand is greater than sum at right hand side


    // get bottom complete_sum_middle innerHTML
    let complete_sum_middle = document.getElementById("complete_sum_middle");
    let right_box = document.getElementById('box_right');
    let quantityUnit_right = right_box.querySelectorAll('.quantityUnit_right');

    // get complete sum
    // - take abs in order to randomize negative sums
    let complete_sum_raw = complete_sum_middle.innerHTML;
    let complete_sum_abs = Math.abs(complete_sum_middle.innerHTML);


    let working_array = get_working_array(euro_units, complete_sum_abs);
    let result_frequency_map = {}
    let result_keys = [
        500,
        200,
        100,
        50,
        20,
        10,
        5,
        2,
        1,
        0.50,
        0.20,
        0.10,
        0.05,
        0.02,
        0.010
    ]

    // init result_frequency_map with units from right side
    for (let idx=0; idx<result_keys.length;idx++) {

        // set 0 as default value
        if (isNaN(quantityUnit_right[idx].valueAsNumber)) {
            result_frequency_map[result_keys[idx]] = 0;
        } else {
            result_frequency_map[result_keys[idx]] = quantityUnit_right[idx].valueAsNumber;
        }
    }

    // get multiplied value of result_frequency_map
    let multipled_result_value = 0;
    for (const [key, value] of Object.entries(result_frequency_map)) {
        multipled_result_value += key * value;
    }

    // choose random euro units from working_array unitl they sum up to euro_sum
    while (complete_sum_abs > 0) {
        working_array = get_working_array(working_array, complete_sum_abs)

        // select random euro_unit from working_array
        random_idx = Math.floor(Math.random() * working_array.length);
        random_unit = working_array[random_idx]

        // increase unit item in frequency map
        result_frequency_map[random_unit] += 1

        // decrease given euro_sum by random_euro_unit
        complete_sum_abs = Number.parseFloat(complete_sum_abs - random_unit).toFixed(2);
    }

    // separate result_frequency_map keys and values
    idx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    keys = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01]
    values = []
    for (i in idx) {
        values.push(keys[i]);
    }

    // get output for bank note numbers and output for referring sum
    middle_box = document.getElementById('box_middle');
    quantityUnit_middle = middle_box.querySelectorAll('.quantityUnit_middle');
    products_middle = middle_box.querySelectorAll('.product_middle');

    // multiply all by -1 if complete_sum_raw was negative
    let sign = 1;
    if (complete_sum_raw < 0) {
        sign = -1;
    }

    // write result_frequency_map to number_bank_note_boxes and sum_bank_note_boxes
    for (let index in idx) {
        value = result_frequency_map[keys[index]];
        console.log(value);
        quantityUnit_middle[index].innerHTML = sign * value;
        products_middle[index].innerHTML = Number.parseFloat(sign * keys[index] * value).toFixed(2);
    }
}

// clicked-button action
let randomized_summands_button = document.getElementById('random_sumands');
randomized_summands_button.addEventListener("click", function (event) { randomized_summands(event) });

function carry_over_randomized_sumands(event) {
    // get all randomized product elements and all right product elements
    products_left = document.querySelectorAll(".product_left");
    products_middle = document.querySelectorAll(".product_middle");
    products_right = document.querySelectorAll(".product_right");

    quantityUnit_left = document.querySelectorAll(".quantityUnit_left");
    quantityUnit_middle = document.querySelectorAll(".quantityUnit_middle");
    quantityUnit_right = document.querySelectorAll(".quantityUnit_right");

    for (let product_idx = 0; product_idx < 15; product_idx++) {
        // copy randomized quantityUnits
        quantityUnit_right[product_idx].value = quantityUnit_middle[product_idx].innerHTML;

        // copy randomized products
        products_right[product_idx].innerHTML = products_middle[product_idx].innerHTML;

        // reset left calculations to 0
        products_left[product_idx].innerHTML = '0';
        quantityUnit_left[product_idx].value = 0;

    }

    // reset left sum to 0
    document.getElementById("complete_sum_left").innerHTML = "0";

    // copy values from middle sum container to right sum container
    document.getElementById("complete_sum_right").innerHTML = document.getElementById("complete_sum_middle").innerHTML;

}

//
let carry_over_button = document.getElementById("carry_over_right");
carry_over_button.addEventListener("click", function (event) { carry_over_randomized_sumands(event) });