import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Помечаем этот класс как сервис, чтобы его можно было внедрять в другие классы.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Наследуемся от базового класса AuthGuard и передаем стратегию 'jwt'.
  // 'jwt' — это имя стратегии, которую мы настраиваем с помощью JwtStrategy.
  // AuthGuard автоматически вызывает стратегию при каждом запросе,
  // проверяет токен и добавляет данные пользователя в объект запроса (req.user).
}
