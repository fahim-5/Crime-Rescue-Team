const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

class UserModel {


  static async create(userData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            full_name,
            username,
            email,
            national_id,
            mobile_no,
            password,
            address,
            role = 'public',
            status = 'approved',
            passport = null
        } = userData;

        // Validate required fields
        const requiredFields = { full_name, username, email, national_id, mobile_no, password, address };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            throw {
                status: 400,
                message: 'Missing required fields',
                fields: missingFields
            };
        }

        // Check for existing user in users table
        const [existingUsers] = await connection.query(
            `SELECT email, username, national_id FROM users 
             WHERE email = ? OR username = ? OR national_id = ?`,
            [email.trim(), username.trim(), national_id.trim()]
        );

        // Check for existing user in public table
        const [existingPublic] = await connection.query(
            `SELECT email, username, national_id FROM public 
             WHERE email = ? OR username = ? OR national_id = ?`,
            [email.trim(), username.trim(), national_id.trim()]
        );

        const existingRecords = [...existingUsers, ...existingPublic];
        
        if (existingRecords.length > 0) {
            const errors = [];
            if (existingRecords.some(u => u.email === email.trim())) {
                errors.push({ field: "email", message: "Email already in use" });
            }
            if (existingRecords.some(u => u.username === username.trim())) {
                errors.push({ field: "username", message: "Username already taken" });
            }
            if (existingRecords.some(u => u.national_id === national_id.trim())) {
                errors.push({ field: "national_id", message: "National ID already registered" });
            }
            throw { status: 400, errors };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users table
        const [userResult] = await connection.query(
            `INSERT INTO users 
            (full_name, username, email, national_id, passport, mobile_no, password, role, address, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                full_name.trim(),
                username.trim().toLowerCase(),
                email.trim().toLowerCase(),
                national_id.trim(),
                passport ? passport.trim() : null,
                mobile_no.trim(),
                hashedPassword,
                role.trim().toLowerCase(),
                address.trim(),
                status.trim().toLowerCase()
            ]
        );

        // Insert into public table (only if role is public)
        if (role === 'public') {
            await connection.query(
                `INSERT INTO public 
                (full_name, username, email, national_id, passport, mobile_no, password, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    full_name.trim(),
                    username.trim().toLowerCase(),
                    email.trim().toLowerCase(),
                    national_id.trim(),
                    passport ? passport.trim() : null,
                    mobile_no.trim(),
                    hashedPassword,
                    address.trim()
                ]
            );
        }

        await connection.commit();

        return {
            id: userResult.insertId,
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            role: role.trim().toLowerCase(),
            status: status.trim().toLowerCase()
        };

    } catch (error) {
        await connection.rollback();
        console.error('Database Error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            throw { 
                status: 409, 
                message: 'Duplicate entry',
                details: error.sqlMessage 
            };
        }
        throw error;
    } finally {
        if (connection) await connection.release();
    }
}



  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email.toLowerCase().trim()]
      );
      return users[0] || null;
    } finally {
      await connection.release();
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async createAdmin(userData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            full_name,
            username,
            email,
            national_id,
            mobile_no,
            password,
            address,
            role = 'admin',
            status = 'approved',
            passport = null
        } = userData;

        // Validate required fields
        const requiredFields = { full_name, username, email, national_id, mobile_no, password, address };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            throw {
                status: 400,
                message: 'Missing required fields',
                fields: missingFields
            };
        }

        // Check for existing user in users table
        const [existingUsers] = await connection.query(
            `SELECT email, username, national_id FROM users 
             WHERE email = ? OR username = ? OR national_id = ?`,
            [email.trim(), username.trim(), national_id.trim()]
        );

        // Check for existing user in admin table
        const [existingAdmin] = await connection.query(
            `SELECT email, username, national_id FROM admin 
             WHERE email = ? OR username = ? OR national_id = ?`,
            [email.trim(), username.trim(), national_id.trim()]
        );

        const existingRecords = [...existingUsers, ...existingAdmin];
        
        if (existingRecords.length > 0) {
            const errors = [];
            if (existingRecords.some(u => u.email === email.trim())) {
                errors.push({ field: "email", message: "Email already in use" });
            }
            if (existingRecords.some(u => u.username === username.trim())) {
                errors.push({ field: "username", message: "Username already taken" });
            }
            if (existingRecords.some(u => u.national_id === national_id.trim())) {
                errors.push({ field: "national_id", message: "National ID already registered" });
            }
            throw { status: 400, errors };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users table
        const [userResult] = await connection.query(
            `INSERT INTO users 
            (full_name, username, email, national_id, passport, mobile_no, password, role, address, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                full_name.trim(),
                username.trim().toLowerCase(),
                email.trim().toLowerCase(),
                national_id.trim(),
                passport ? passport.trim() : null,
                mobile_no.trim(),
                hashedPassword,
                role.trim().toLowerCase(),
                address.trim(),
                status.trim().toLowerCase()
            ]
        );

        // Insert into admin table (only if role is admin)
        if (role === 'admin') {
            await connection.query(
                `INSERT INTO admin 
                (full_name, username, email, national_id, passport, mobile_no, password, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    full_name.trim(),
                    username.trim().toLowerCase(),
                    email.trim().toLowerCase(),
                    national_id.trim(),
                    passport ? passport.trim() : null,
                    mobile_no.trim(),
                    hashedPassword,
                    address.trim()
                ]
            );
        }

        await connection.commit();

        return {
            id: userResult.insertId,
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            role: role.trim().toLowerCase(),
            status: status.trim().toLowerCase()
        };

    } catch (error) {
        await connection.rollback();
        console.error('Database Error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            throw { 
                status: 409, 
                message: 'Duplicate entry',
                details: error.sqlMessage 
            };
        }
        throw error;
    } finally {
        if (connection) await connection.release();
    }
}



static async createPolice(policeData) {
  const connection = await pool.getConnection();
  try {
      await connection.beginTransaction();

      // Set default police values
      const policeDefaults = {
          role: 'police',
          status: 'pending' // Police accounts typically require approval
      };

      // Merge provided data with police defaults
      const userData = {
          ...policeData,
          ...policeDefaults
      };

      // Destructure with validation
      const {
          full_name,
          username,
          email,
          national_id,
          mobile_no,
          password,
          address,
          police_id,
          station,
          rank,
          badge_number,
          joining_date,
          passport = null
      } = userData;

      // Validate required fields for police
      const requiredFields = { 
          full_name, 
          username, 
          email, 
          national_id, 
          mobile_no, 
          password, 
          address,
          police_id,
          station,
          rank,
          badge_number,
          joining_date
      };

      const missingFields = Object.entries(requiredFields)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

      if (missingFields.length > 0) {
          throw {
              status: 400,
              message: 'Missing required fields for police registration',
              fields: missingFields
          };
      }

      // Check for existing police with same credentials
      const [existingPolice] = await connection.query(
          `SELECT * FROM users 
          WHERE (email = ? OR username = ? OR national_id = ? OR police_id = ? OR badge_number = ?)
          AND role = 'police'`,
          [email.trim(), username.trim(), national_id.trim(), police_id.trim(), badge_number.trim()]
      );

      if (existingPolice.length > 0) {
          const errors = [];
          if (existingPolice.some(u => u.email === email.trim())) {
              errors.push({ field: "email", message: "Email already used by another officer" });
          }
          if (existingPolice.some(u => u.username === username.trim())) {
              errors.push({ field: "username", message: "Username already taken by another officer" });
          }
          if (existingPolice.some(u => u.national_id === national_id.trim())) {
              errors.push({ field: "national_id", message: "National ID already registered by another officer" });
          }
          if (existingPolice.some(u => u.police_id === police_id.trim())) {
              errors.push({ field: "police_id", message: "Police ID already in use" });
          }
          if (existingPolice.some(u => u.badge_number === badge_number.trim())) {
              errors.push({ field: "badge_number", message: "Badge number already assigned" });
          }
          throw { status: 400, errors };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into users table (with status)
      const [userResult] = await connection.query(
          `INSERT INTO users 
          (full_name, username, email, national_id, passport, mobile_no, 
           password, role, address, status, police_id, station, rank, badge_number, joining_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              full_name.trim(),
              username.trim().toLowerCase(),
              email.trim().toLowerCase(),
              national_id.trim(),
              passport ? passport.trim() : null,
              mobile_no.trim(),
              hashedPassword,
              'police',
              address.trim(),
              'pending',
              police_id.trim(),
              station.trim(),
              rank.trim(),
              badge_number.trim(),
              new Date(joining_date)
          ]
      );

      // Insert into police table (without status)
      await connection.query(
          `INSERT INTO police 
          (full_name, username, email, national_id, passport, mobile_no, 
           password, address, police_id, station, rank, badge_number, joining_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              full_name.trim(),
              username.trim().toLowerCase(),
              email.trim().toLowerCase(),
              national_id.trim(),
              passport ? passport.trim() : null,
              mobile_no.trim(),
              hashedPassword,
              address.trim(),
              police_id.trim(),
              station.trim(),
              rank.trim(),
              badge_number.trim(),
              new Date(joining_date)
          ]
      );

      await connection.commit();

      return {
          id: userResult.insertId,
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          role: 'police',
          status: 'pending',
          police_id: police_id.trim(),
          badge_number: badge_number.trim()
      };

  } catch (error) {
      await connection.rollback();
      console.error('Police Registration Error:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
          throw { 
              status: 409, 
              message: 'Police officer with these details already exists',
              details: error.sqlMessage 
          };
      }
      throw error;
  } finally {
      if (connection) await connection.release();
  }
}









}


module.exports = UserModel;