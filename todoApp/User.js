const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  petName: { type: String, default: '이름 없음' },  // 반려동물 이름 (기본값 설정)
  petType: { type: String, default: '종류 없음' },  // 반려동물 종류 (기본값 설정)
});

module.exports = mongoose.model('User', UserSchema);
