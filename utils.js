const product_nodes = {
    "left": document.querySelectorAll('.quantityUnit_left'),
    "middle": document.querySelectorAll('.quantityUnit_middle'),
    "right": document.querySelectorAll('.quantityUnit_right'),
}


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
    right_target.innerHTML = (currencyUnit * quantity).toFixed(2);

    // get column container of form 'box_<left|middle|right>' in order
    // to find all child nodes of class 'product_<left|middle|right>
    let column_container = event.path[2];
    let product_nodes = column_container.querySelectorAll(
        '.product_left, .product_middle, .product_right'
    );

    let sum = 0;
    for (let i = 0; i < 15; i++) {
        sum += parseFloat(product_nodes[i].innerHTML)
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
    //let complete_sum_left = document.getElementById("complete_checksum_middle");

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