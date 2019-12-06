const tabViewModel = {
    transferpartners: ko.observableArray([]),
    airlineTable: ko.observableArray([]),
    filter1: ko.observable(''),
    filter2: ko.observable(''),
    filter3: ko.observable(''),
    firstIndexFilter2: ko.observable(''),
    programs: ko.observableArray([])
};

// const apiMainURI = "http://localhost:4000/api/";
const apiMainURI = "http://142.93.206.230:4000/api/";

fetchData = async function () {
    let data = []
    if (sessionStorage.getItem('data') == undefined) {
        data = await $.getJSON(apiMainURI + 'transferpartners')
        sessionStorage.setItem('data', JSON.stringify(data))
    } else {
        data = JSON.parse(sessionStorage.getItem('data'))
    }

    let table = []
    let airlineTable = []

    let banks = []
    let programs = []
    let airlines = []


    data.map(x => {
        x.programs.map(y => {
            // programs tab (second tab)
            if (programs.find(program => program == y.name) == undefined) {
                programs.push(y.name)
                $("#selectpicker2").append('<option value="' + y.name + '" selected="">' + y.name + '</option>');
            }
            // banks tab (first tab)
            if (banks.find(bank => bank == x.bankProgram) == undefined) // not found before
            {
                banks.push(x.bankProgram)
                $("#selectpicker").append('<option value="' + x.bankProgram + '" selected="">' + x.bankProgram + '</option>');
            }

            table.push({ bank: x.bankProgram, bankIcon: x.bankIcon, program: y })

            if (y.airlines == undefined) return

            y.airlines.map(airline => {

                airlineTable.push({ bank: x.bank, bankIcon: x.bankIcon, rate: y.rate, airline })

            })
            // airlines tab (third tab)
            y.airlines.map(airline => {
                if (airlines.find(ar => ar == airline.name) == undefined) // not found before
                {
                    airlines.push(airline.name)
                    $("#selectpicker3").append('<option value="' + airline.name + '" selected="">' + airline.name + '</option>');
                }
            })

        })
    })

    console.log(table)
    tabViewModel.transferpartners(table);
    tabViewModel.airlineTable(airlineTable);
    tabViewModel.programs(programs);
    $(document).ready(function () {
        $('#selectpicker').val(1)
        $('#selectpicker2').val(1)
        $('#selectpicker3').val(1)
        // reload selectors to get new data
        $("#selectpicker").selectpicker("refresh");
        $("#selectpicker2").selectpicker("refresh")
        $("#selectpicker3").selectpicker("refresh")
        // $('.dropdown-menu').addClass('show')

        // second tab (program tab)
        tabViewModel.filter1('NONE')// apply filter to bank tab
        tabViewModel.filter2('NONE')// apply filter to program tab
        tabViewModel.filter3('NONE')// apply filter to program tab

        $('button[data-id=selectpicker2]').on('click', fixStyles)
        $('button[data-id=selectpicker3]').on('click', fixStyles)

        $('input[aria-label="Search"]').on('input', fixStyles)
        // to display the right list once in the program tab
        // let index;
        // for (let x of tabViewModel.transferpartners()) {
        //     if (x.program.name == $('#selectpicker2').val()) {
        //         index = tabViewModel.transferpartners().indexOf(x)
        //     }
        // }
        tabViewModel.firstIndexFilter2(0)
    })
}

fetchData()

function fixStyles() {
    // remove all the weird styles bootstrap-select adds
    document.querySelector('#program .select .dropdown .dropdown-menu').style = ''
    document.querySelector('#airline .select .dropdown .dropdown-menu').style = ''
}

function filter1Change() {
    let val = $('#selectpicker').val()
    console.log('filter1 changed to ', val)
    tabViewModel.filter1(val)
}

function filter2Change() {
    let val = $('#selectpicker2').val()
    console.log('filter2 changed to ', val)
    let index = null;
    tabViewModel.transferpartners().map((x, i) => {
        if (x.program.name == val && index == null) {
            index = i
        }
    })
    if(index==null){
        tabViewModel.firstIndexFilter2(0)
    }
    tabViewModel.firstIndexFilter2(index)
    tabViewModel.filter2(val)
}


function filter3Change() {
    let val = $('#selectpicker3').val()
    console.log('filter3 changed to ', val)
    tabViewModel.filter3(val)
}

ko.applyBindings(tabViewModel);
