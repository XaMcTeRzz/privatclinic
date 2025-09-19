-- SQL скрипт для обновления политик безопасности таблиц

-- Удаляем существующие политики для site_settings
DROP POLICY IF EXISTS "Allow read access to site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow write access to site_settings" ON site_settings;

-- Создаем новые политики для site_settings
CREATE POLICY "Allow read access to site_settings" ON site_settings
FOR SELECT USING (true);

CREATE POLICY "Allow write access to site_settings" ON site_settings
FOR ALL USING (true) WITH CHECK (true);

-- Удаляем существующие политики для news
DROP POLICY IF EXISTS "Allow read access to news" ON news;
DROP POLICY IF EXISTS "Allow write access to news" ON news;

-- Создаем новые политики для news
CREATE POLICY "Allow read access to news" ON news
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow write access to news" ON news
FOR ALL USING (true) WITH CHECK (true);

-- Удаляем существующие политики для doctors
DROP POLICY IF EXISTS "Allow read access to doctors" ON doctors;
DROP POLICY IF EXISTS "Allow write access to doctors" ON doctors;

-- Создаем новые политики для doctors
CREATE POLICY "Allow read access to doctors" ON doctors
FOR SELECT USING (true);

CREATE POLICY "Allow write access to doctors" ON doctors
FOR ALL USING (true) WITH CHECK (true);

-- Удаляем существующие политики для services
DROP POLICY IF EXISTS "Allow read access to services" ON services;
DROP POLICY IF EXISTS "Allow write access to services" ON services;

-- Создаем новые политики для services
CREATE POLICY "Allow read access to services" ON services
FOR SELECT USING (true);

CREATE POLICY "Allow write access to services" ON services
FOR ALL USING (true) WITH CHECK (true);