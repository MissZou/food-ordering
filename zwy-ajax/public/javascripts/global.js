var userListData = [];

$(document).ready(function() {
    populateTable();
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
 	// Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

function populateTable() {
    var tableContent = "";
    $.getJSON("/users/userlist", function(data) {
        userListData=data;


        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        $('#userList table tbody').html(tableContent);
    });
}

function showUserInfo(e){
	e.preventDefault();

	var thisUserName=$(this).attr("rel");
	var allUsername=userListData.map(function(arrayItem){
		return arrayItem.username;
	});

	var arrayPosition=allUsername.indexOf(thisUserName);
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}

function addUser(e){
	e.preventDefault();

	//如果有空格就+1
	var errorCount=0;
	$("#addUser input").each(function(index,val){
		if($(this).val()===""){
			errorCount++;
		}
	});

	if(errorCount === 0){
		var newUser={
			'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
		};


		$.ajax({
			type:"POST",
			data:newUser,
			url:"/users/adduser",
			dataType:"JSON"
		}).done(function(response){
			if(response.msg===""){
				//清空input框
				$("#addUser fieldset input").val("");

				populateTable();
			}else{
				alert("Error");
			}
		});


	}else{
		alert("填完空格啊");
		return false;
	}
}

function deleteUser(e){
	e.preventDefault();

	var confirmation=confirm("真的要删吗？");

	if(confirmation){
		$.ajax({
			type:"DELETE",
			url:"/users/deleteuser/"+$(this).attr("rel")
		}).done(function(response){
			if(response.msg!==""){
				alert(response.msg);
			}
			populateTable();
		});
	}else{
		return false;
	}
}
