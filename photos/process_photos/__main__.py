from .process_photos import process_photos, parse_arguments

if __name__ == "__main__":
    cli_args = parse_arguments()
    process_photos(cli_args)
