var groupBills = require('./groupBills');

function sortByTotals(billsGrouped) {
    billsGrouped.sort(function(g1, g2) {
        if (g1.tot == g2.tot) {
            return 0;
        }
        return g1.tot > g2.tot ? -1 : 1;
    });
    return billsGrouped;
}

function groupBillsByCustomer(bills) {

    return groupBills(bills, function(bill) {
        return bill.customer;
    }, sortByTotals);

}

function onlyData(bills) {

    return groupBills.onlyData(bills, function(bill) {
        return bill.customer;
    }, sortByTotals);

}


module.exports = groupBillsByCustomer;
module.exports.onlyData = onlyData;