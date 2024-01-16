import hashlib
import sqlite3
from flask import Flask, request
from flask_cors import CORS

def hash_phone_number(phone_number):
    # Convert the phone number to a byte string
    byte_phone = phone_number.encode()

    # Create a new sha256 hash object
    hasher = hashlib.sha256()

    # Update the hash object with the byte string
    hasher.update(byte_phone)

    # Return the hexadecimal representation of the digest
    return hasher.hexdigest()
def clear_database():
    # Connect to a database (or create one if it doesn't exist)
    conn = sqlite3.connect('my_database.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()

    # Execute a query
    cursor.execute('DROP TABLE IF EXISTS users')

    # Save (commit) the changes
    conn.commit()

    # Close the connection
    conn.close()
def init_database():
    # Connect to a database (or create one if it doesn't exist)
    conn = sqlite3.connect('my_database.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()
    # Clear the database
    # cursor.execute('DROP TABLE IF EXISTS users')
    # conn.commit()

    # Check if the table exists
    table_name = 'users'
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
    result = cursor.fetchone()
    if result:
        print(f"Table '{table_name}' exists.")
        return
    # Create a table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        hashed_phone_number TEXT NOT NULL,
        user_name TEXT NOT NULL,
        plan TEXT NOT NULL,
        provider TEXT NOT NULL,
        PRIMARY KEY (hashed_phone_number, user_name)
        )
    ''')
    conn.commit()
    # Insert some data
    data = [
        ("1234567890", "Alice", "Basic", "Provider1"),
        ("0987654321", "Bob", "Premium", "Provider2")
    ]
    for row in data:
        hashed_phone = hash_phone_number(row[0])
        user_name = row[1]
        plan = row[2]
        provider = row[3]
        
        try:
            cursor.execute('''
                INSERT INTO users (hashed_phone_number, user_name, plan, provider) 
                VALUES (?, ?, ?, ?)
            ''', (hashed_phone, user_name, plan, provider))
        except sqlite3.IntegrityError as e:
            print(f"Error occurred: {e}")
    conn.commit()

    conn.close()
def print_database():
    # Connect to a database (or create one if it doesn't exist)
    conn = sqlite3.connect('my_database.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()

    # Execute a query
    cursor.execute('SELECT * FROM users')

    # Fetch all rows from the last executed statement
    results = cursor.fetchall()

    # Print the results
    for row in results:
        print(row)

    # Close the connection
    conn.close()
def add_user(phone_number, user_name, plan, provider):
    # Connect to a database (or create one if it doesn't exist)
    conn = sqlite3.connect('my_database.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()
    hashed_phone_number=hash_phone_number(phone_number)
    # Insert some data
    try:
        cursor.execute('''
            INSERT INTO users (hashed_phone_number, user_name, plan, provider) 
            VALUES (?, ?, ?, ?)
        ''', (hashed_phone_number, user_name, plan, provider))
    except sqlite3.IntegrityError as e:
        print(f"Error occurred: {e}")
    conn.commit()

    conn.close()
def delete_user(phone_number, user_name):
    # Connect to a database (or create one if it doesn't exist)
    conn = sqlite3.connect('my_database.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()
    hashed_phone_number=hash_phone_number(phone_number)
    # Insert some data
    try:
        cursor.execute('''
            DELETE FROM users WHERE hashed_phone_number=? AND user_name=?
        ''', (hashed_phone_number, user_name))
    except sqlite3.IntegrityError as e:
        print(f"Error occurred: {e}")
    conn.commit()

    conn.close()
def get_user(phone_number, user_name):
    # Connect to a database (or create one if it doesn't exist)
    conn = sqlite3.connect('my_database.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()
    hashed_phone_number=hash_phone_number(phone_number)
    # Find some data
    try:
        cursor.execute('''
            SELECT * FROM users WHERE hashed_phone_number=? AND user_name=?
        ''', (hashed_phone_number, user_name))
    except sqlite3.IntegrityError as e:
        print(f"Error occurred: {e}")
    conn.commit()
    results = cursor.fetchall()
    conn.close()
    return results

# init_database()
# add_user("0912345687", "Alice", "Basic", "Provider1")



app = Flask(__name__)
CORS(app)

@app.route('/get_provider/<phone_number>/<user_name>', methods=['GET'])
def get_provider_route(phone_number, user_name):
    print(phone_number, user_name)
    user=get_user(phone_number, user_name)
    if len(user)==0:
        return "No such user", 404
    return user[0][3], 200

@app.route('/add_user', methods=['POST'])
def add_user_route():
    phone_number = request.get_json().get('phone_number')
    user_name = request.get_json().get('user_name')
    plan = request.get_json().get('plan')
    provider = request.get_json().get('provider')
    print(phone_number, user_name, plan, provider)
    try:
        add_user(phone_number, user_name, plan, provider)
    except:
        return "Error", 400
    return "OK", 200
@app.route('/delete_user/<phone_number>/<username>', methods=['DELETE'])
def delete_user_route(phone_number, username):
    try:
        delete_user(phone_number, username)
    except:
        return "Error", 400
    return "OK", 200
@app.route('/print_database', methods=['GET'])
def print_database_route():
    print_database()
    return "OK", 200

if __name__ == '__main__':
    init_database()
    app.run(debug=True, port=5000)
