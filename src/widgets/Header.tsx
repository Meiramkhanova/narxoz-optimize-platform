import Container from "@/shared/ui/Container";
import Image from "next/image";

function Header() {
  return (
    <header className="header-wrapper border-b border-border bg-card">
      <Container>
        <div className="mx-auto py-8 flex items-center justify-between">
          <Image
            src="/Narxoz_University_logo.png"
            alt="narxoz-logo"
            width={200}
            height={300}
            className="w-40 object-cover"
            loading="eager"
          />

          <div className="header-info-field hidden md:block text-end">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Управление запросами студентов
            </h1>

            <p className="mt-2 text text-muted-foreground">
              Поиск и фильтрация запросов студентов по имени и вопросу.
            </p>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
