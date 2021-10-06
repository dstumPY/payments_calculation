function multiply_money_with_number(strInputBox, strOutputBox, monetary_factor) {
    let inputBox = document.getElementById(strInputBox);
    let right_sum_box = document.getElementById('complete_sum_right');
    let middle_sum_box = document.getElementById('complete_sum_middle');
    let middle_checksum_box = document.getElementById('complete_checksum_middle');

    inputBox.onkeyup = function() {
        // calculate sum only within the row
        let number_payment = inputBox.value;
        let left_sum_box = document.getElementById(strOutputBox);
        left_sum_box.innerHTML = number_payment * monetary_factor;
        middle_sum_box.innerHTML = parseFloat(left_sum_box.innerHTML) - parseFloat(right_sum_box.innerHTML);
        middle_checksum_box.innerHTML = parseFloat(left_sum_box.innerHTML) - parseFloat(right_sum_box.innerHTML);
    }

}


function calc_sum_on_units(outer_box, strInputBox, strOutputBox, monetary_factor) {
    let outer_box_elt = document.getElementById(outer_box);
    let inputBox = document.getElementById(strInputBox);

    // select right or left div box (box_left resp. box_right)
    if (outer_box === 'box_right') {
        let sumBox = document.getElementById('complete_sum_right');
        let positions_euro_sum = outer_box_elt.querySelectorAll('.product_right')
    } else if (outer_box === 'box_left') {
        let sumBox = document.getElementById('complete_sum_left');
        let positions_euro_sum = outer_box_elt.querySelectorAll('.product_left')
    }


    // function
    inputBox.onkeyup = function() {
        // calculate sum onyl in the row
        let number_payment = inputBox.value;
        document.getElementById(strOutputBox).innerHTML = number_payment * monetary_factor;

        // sum up all partial sum
        let sum = 0;
        for (let i = 0; i < 15; i++) {
            sum += parseFloat(positions_euro_sum[i].innerHTML);
        }

        // write final sum to complete_sum_right
        sumBox.innerHTML = sum;
    }
}


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

/**
Return the sum from all .innerHTML values of a given querySelectorAll element.
@param {object} query_selector_all_object executet querySelectorAll object
@return {int}   Sum from all innerHTML values of query_selector_all_object
**/
function sum_all_innerHTML(query_selector_all_object) {
    let sum = 0;
    for (let i = 0; i < 15; i++) {
        sum += parseFloat(query_selector_all_object[i].innerHTML);
    }
    console.log("sum:", sum)
    return Number.parseFloat(sum).toFixed(2);
}


function get_euro_unit_distribution_from_sum() {
    let button_item = document.getElementById('button_calculation')

    // init all possible euro payment sizes
    const euro_units = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];

    // read final sum box values (left and right)
    let out_sum_left = document.getElementById('complete_sum_left');
    let out_sum_right = document.getElementById('complete_sum_right');
    let out_sum_middle_item = document.getElementById('complete_sum_middle');


    button_item.onclick = function() {
        // init values
        let euro_sum = out_sum_middle_item.innerHTML;
        let working_array = get_working_array(euro_units, euro_sum);
        let result_frequency_map = {
            500: 0,
            200: 0,
            100: 0,
            50: 0,
            20: 0,
            10: 0,
            5: 0,
            2: 0,
            1: 0,
            0.50: 0,
            0.20: 0,
            0.10: 0,
            0.05: 0,
            0.02: 0,
            0.01: 0
        }

        // choose random euro units from working_array unitl they sum up to euro_sum
        while (euro_sum > 0) {
            working_array = get_working_array(working_array, euro_sum)

            // select random euro_unit from working_array
            random_idx = Math.floor(Math.random() * working_array.length);
            random_euro_unit = working_array[random_idx]

            // increase unit item in frequency map
            result_frequency_map[random_euro_unit] += 1

            // decrease given euro_sum by random_euro_unit
            euro_sum = Number.parseFloat(euro_sum - random_euro_unit).toFixed(2);
        }


        // get output for bank note numbers and output for referring sum
        middle_box = document.getElementById('box_middle');
        number_bank_note_boxes = middle_box.querySelectorAll('.box_unit');
        sum_bank_notes_boxes = middle_box.querySelectorAll('.product_middle');
        complete_sum_difference_box = document.getElementById('complete_sum_middle')
        complete_checksum_difference_box = document.getElementById('complete_checksum_middle')

        // separate result_frequency_map keys and values
        idx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        keys = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01]
        values = []
        for (i in idx) {
            console.log(i)
            console.log(keys[i])
                //console.log(value)
            values.push(keys[i]);
            //i++;
        }

        // write result_frequency_map to number_bank_note_boxes and sum_bank_note_boxes
        for (let index in idx) {
            value = result_frequency_map[keys[index]];
            console.log(value)
            number_bank_note_boxes[index].innerHTML = value;
            sum_bank_notes_boxes[index].innerHTML = Number.parseFloat(keys[index] * value).toFixed(2);
        }

        // update complete_sum_middle
        tmp_sum = complete_sum_difference_box.innerHTML;
        console.log(tmp_sum)
        sum_from_boxes = sum_all_innerHTML(sum_bank_notes_boxes);
        console.log(sum_from_boxes)
        complete_checksum_difference_box.innerHTML = tmp_sum - sum_from_boxes;
    }
}

// calc row-wise sums
calc_sum_on_units('box_right', 'input500_right', 'out500_right', 500.0);
calc_sum_on_units('box_right', 'input200_right', 'out200_right', 200.0);
calc_sum_on_units('box_right', 'input100_right', 'out100_right', 100.0);
calc_sum_on_units('box_right', 'input50_right', 'out50_right', 50.0);
calc_sum_on_units('box_right', 'input20_right', 'out20_right', 20.0);
calc_sum_on_units('box_right', 'input10_right', 'out10_right', 10.0);
calc_sum_on_units('box_right', 'input5_right', 'out5_right', 5.0);
calc_sum_on_units('box_right', 'input2_right', 'out2_right', 2.0);
calc_sum_on_units('box_right', 'input1_right', 'out1_right', 1.0);
calc_sum_on_units('box_right', 'input050_right', 'out050_right', 0.5);
calc_sum_on_units('box_right', 'input020_right', 'out020_right', 0.2);
calc_sum_on_units('box_right', 'input010_right', 'out010_right', 0.1);
calc_sum_on_units('box_right', 'input005_right', 'out005_right', 0.05);
calc_sum_on_units('box_right', 'input002_right', 'out002_right', 0.02);
calc_sum_on_units('box_right', 'input001_right', 'out001_right', 0.01);

multiply_money_with_number('input_sum_actual_left', 'complete_sum_left', 1)

calc_sum_on_units('box_left', 'input500_left', 'out500_left', 500.0);
calc_sum_on_units('box_left', 'input200_left', 'out200_left', 200.0);
calc_sum_on_units('box_left', 'input100_left', 'out100_left', 100.0);
calc_sum_on_units('box_left', 'input50_left', 'out50_left', 50.0);
calc_sum_on_units('box_left', 'input20_left', 'out20_left', 20.0);
calc_sum_on_units('box_left', 'input10_left', 'out10_left', 10.0);
calc_sum_on_units('box_left', 'input5_left', 'out5_left', 5.0);
calc_sum_on_units('box_left', 'input2_left', 'out2_left', 2.0);
calc_sum_on_units('box_left', 'input1_left', 'out1_left', 1.0);
calc_sum_on_units('box_left', 'input050_left', 'out050_left', 0.5);
calc_sum_on_units('box_left', 'input020_left', 'out020_left', 0.2);
calc_sum_on_units('box_left', 'input010_left', 'out010_left', 0.1);
calc_sum_on_units('box_left', 'input005_left', 'out005_left', 0.05);
calc_sum_on_units('box_left', 'input002_left', 'out002_left', 0.02);
calc_sum_on_units('box_left', 'input001_left', 'out001_left', 0.01);

get_euro_unit_distribution_from_sum()