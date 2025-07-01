<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{

    public function index()
{
    $users = \App\Models\User::paginate(10);
    return inertia('Users/Index', compact('users'));
}

    /**
     * Display a listing of the resource.
     */
    public function create()
    {
        return inertia('Users/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,cashier,operator,delivery,setrika',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('users.index')->with('success', 'User created!');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return inertia('Users/Edit', compact('user'));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
            'role' => 'required|in:admin,cashier,operator,delivery,setrika',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->role = $request->role;
        $user->phone_number = $request->phone_number;
        $user->address = $request->address;
        $user->is_active = $request->is_active ?? true;
        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted!');
    }
}
