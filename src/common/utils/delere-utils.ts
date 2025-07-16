import * as fs from 'fs';
import * as path from 'path';

export function deleteMovieFile(filePathToDelete: string) {
  const fullPath = path.resolve(filePathToDelete);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('❌ Faylni o‘chirishda xatolik:', err.message);
      } else {
        console.log('✅ Fayl muvaffaqiyatli o‘chirildi:', fullPath);
      }
    });
  } else {
    console.warn('⚠️ Fayl topilmadi:', fullPath);
  }
}
