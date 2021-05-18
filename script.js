var state = {
    entries: [], 
    count: 0, 
    update: NaN,
    isAddEnabled: true,
}

$(document).ready(function(){
updateDOM();           
}); 

function getId() {
    return state.count++;
}

function getEntry(event) {
const entry = {}
event.preventDefault();
entry.name= $("#inputName").val();
entry.email = ($("#inputEmail").val());

return entry;
}


$("#my-form").submit(() => {
addEntry();
})
addEntry = () => {

state.entries = [...state.entries, getEntry(event)]
console.log(state.entries);
updateDOM();
}

function updateDOM(){
    
    clearTable();
    clearForm();
    $("#updateBtn").attr('disabled', state.isAddEnabled);
    $("#addBtn").attr('disabled', !state.isAddEnabled);
    state.entries.map((entry,i) => {
        const newEntry = `
            <tr id="${i}">
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td>
                    <a data-id="${i}" href="#" onclick="fillForm()">Update </a>
                </td>
            </tr>
        `
        $("#entryData").append(newEntry);
    });
}


function clearTable() {
    
    $("#entryData").empty();
}

removeEntry = () => {
    let i = event.target.dataset.id;
    const newEntries = [...state.entries]
    newEntries.splice(i, 1);

    state.entries = newEntries;
    updateDOM();
}

function clearForm() {
    document.querySelector("#inputName").focus();
    $("#inputEmail").val("");
    $("#my-form").trigger("reset");
}

fillForm = () => {
    state.update = event.target.dataset.id;
    state.isAddEnabled = false;
    updateDOM();
    const e = state.entries[event.target.dataset.id];
    $("#inputName").val(e.name);
    $("#inputEmail").val(e.email);
}


updateEntry = () => {
    state.entries[state.update] = getEntry(event);
    state.isAddEnabled = true;
    updateDOM();
}

resetForm = () => {
    event.preventDefault();
    state.update = NaN; 
    clearForm();
    state.isAddEnabled = true;
    updateDOM();
}


$(function (){
    var $orders = $('#orders');
    var $title = $('#title');
    var template = $('#staff-template').html();

    function addstaff(items){
        $orders.append(Mustache.render(template,items));
    }

    $.ajax({
        type: 'GET',
        url:'https://jsonplaceholder.typicode.com/albums',
        success: function(data){
            $.each(data,function(i,item){    /* data(array) i is index and item is an item of data */
                addstaff(item);
            })
        },
        error: function(){
            alert('error loading orders');
        }
    });

    $('#add-staff').on('click', function(){
        var staff = {
            title : $title.val(),
        }

        $.ajax({
            type : 'POST',
            url :'https://jsonplaceholder.typicode.com/albums',
            data : staff,
            success : function(newstaff){
                addstaff(newstaff);
            },
            error: function(){
                alert('error saving new staff');
            }

        });
        $title.val('');
    });

    $orders.delegate('.remove','click',function(){
        var $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: 'https://jsonplaceholder.typicode.com/albums/' + $(this).attr('data-id'),
            success: function(){
                $li.fadeOut(300,function(){
                    console.log('done');
                    $(this).remove();
                });
            }
        });
    })

    $orders.delegate('.editOrder','click',function(){
        var $li = $(this).closest('li');
        $li.find('input.title').val($li.find('span.title').html());
        $li.addClass('edit');
    });

    $orders.delegate('.cancelEdit','click',function(){
        $(this).closest('li').removeClass('edit');
    });

    $orders.delegate('.saveEdit','click',function(){
        var $li = $(this).closest('li');
        var newstaff = {
            title: $li.find('input.title').val(),
        };
        $.ajax({
            type : 'PUT',
            url :'https://jsonplaceholder.typicode.com/albums/' + $li.attr('data-id'),
            data : newstaff,
            
            success : function(newstaff){
                $li.find('span.title').html(newstaff.title);
                $li.removeClass('edit');
            },
            error: function(){
                alert('error updating new staff');
            }
        });
    })
})