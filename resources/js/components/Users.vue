<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdmin">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="newModal()">Add New <i class="fas fa-user-plus"></i></button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>E-Mail</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>

                            <tr v-for="user in users" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.type | upText }}</td>
                                <td>{{ user.created_at | myDate }}</td>
                                <td>
                                    <a href="#" @click="editModal(user)"> <i class="fas fa-edit blue"> </i></a> |
                                    <a href="#" @click="deleteUser(user.id)"><i class="fa fa-trash red"></i></a>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>


        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNew" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewLabel" v-show="!editmode">Add New User</h5>
                        <h5 class="modal-title" id="addNewLabel2" v-show="editmode">Edit User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form @submit.prevent="editmode ? updateUser() : createUser()">


                    <div class="modal-body">

                            <div class="form-group">
                                <input v-model="form.name" type="text" name="name" placeholder="Name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.email" type="email" name="email" placeholder="E-Mail Address"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <textarea v-model="form.bio" type="text" name="bio" placeholder="Short Bio for user (Optional)"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }">
                                </textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>

                            <div class="form-group">
                                <select name="type" id="type" v-model="form.type" class="form-control" :class="{ 'is-invalid': form.errors.has('type')}">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.password" type="password" name="password" placeholder="Password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>



                    </div>


                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
                        <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>

                    </div>

                    </form>

                </div>


            </div>
        </div>


    </div>




</template>


<script>
    export default {
        data(){
            return {
                editmode : false,
                users : {},
                form: new Form({
                    id: '',
                    name : '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods: {
            updateUser(){
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id)
                    .then(() => {

                    Toast.fire({
                    type: 'success',
                    title: 'User Updated successfully'
                })

                    $('#addNew').modal('hide')

                Fire.$emit('AfterCreate');



            })
                    .catch(() => {
                    this.$Progress.fail();
                });
            },
            editModal(user){
                this.editmode = true;
                this.form.reset();
                $('#addNew').modal('show')
                this.form.fill(user)
            },
            newModal(){
                this.editmode = false;
                this.form.reset();
                $('#addNew').modal('show')
            },
            deleteUser(id){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) =>  {
                    // send ajax rquest to server
                    this.form.delete('api/user/'+id).then(() => {
                    if (result.value) {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    Fire.$emit('AfterCreate');

                }
                }).catch(() => {
                    Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: '<a href>Why do I have this issue?</a>'
                })
                })


            })

            },

            loadUsers(){
                if(this.$gate.isAdmin()){
                    axios.get("api/user").then(({ data}) => (this.users = data.data));
                }
            },

            createUser(){
                this.$Progress.start();
                this.form.post('api/user')
                    .then(() => {
                    Fire.$emit('AfterCreate');

                $('#addNew').modal('hide')

                Toast.fire({
                    type: 'success',
                    title: 'User Created successfully'
                })

                this.$Progress.finish()
                })
                    .catch(() => {

                })
            }
        },

        created(){
            this.loadUsers();
            Fire.$on('AfterCreate', () => {
                this.loadUsers();
            });
            // setInterval( () => this.loadUsers(), 3000);
        }
    }
</script>


