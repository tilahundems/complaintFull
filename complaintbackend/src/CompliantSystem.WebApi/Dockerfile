FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY CompliantSystem.sln .
COPY src/CompliantSystem.Application/ ./src/CompliantSystem.Application/
COPY src/CompliantSystem.Domain/ ./src/CompliantSystem.Domain/
COPY src/CompliantSystem.Infrastructure/ ./src/CompliantSystem.Infrastructure/
COPY src/CompliantSystem.WebApi/ ./src/CompliantSystem.WebApi/

WORKDIR /src/src/CompliantSystem.WebApi
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CompliantSystem.WebApi.dll"]
